const express = require('express');
const db = require('../db');
const Redis = require('redis');
const { notifyResource } = require('../socket');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

// simple middleware to verify JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'no auth' });
    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: 'invalid token' });
    }
}

// list resources
router.get('/resources', async (req, res) => {
    const r = await db.query('SELECT * FROM resources ORDER BY name');
    res.json(r.rows);
});

// create resource (admin)
router.post('/resources', auth, async (req, res) => {
    const { name, timezone } = req.body;
    const r = await db.query('INSERT INTO resources(name, timezone) VALUES($1,$2) RETURNING *', [name, timezone || 'UTC']);
    res.json(r.rows[0]);
});

// get bookings for resource
router.get('/resource/:id/bookings', async (req, res) => {
    const { id } = req.params;
    const { from, to } = req.query;
    const q = await db.query('SELECT * FROM bookings WHERE resource_id=$1 AND start_ts >= $2 AND end_ts <= $3 ORDER BY start_ts', [id, from || '1970-01-01', to || '9999-01-01']);
    res.json(q.rows);
});

// create booking - uses Redis lock to prevent double booking
router.post('/resource/:id/book', auth, async (req, res) => {
    const resourceId = req.params.id;
    const { start_ts, end_ts } = req.body;
    // Basic validation
    if (!start_ts || !end_ts) return res.status(400).json({ error: 'start and end required' });

    const lockKey = `lock:resource:${resourceId}:${start_ts}`;
    const lockToken = uuidv4();
    // Attempt to acquire lock
    const locked = await redisClient.set(lockKey, lockToken, { NX: true, PX: 5000 });
    if (!locked) {
        return res.status(409).json({ error: 'slot locked, try again' });
    }

    try {
        // Check for conflicting bookings
        const conflict = await db.query(
            `SELECT 1 FROM bookings WHERE resource_id=$1 AND status='confirmed' AND NOT ($3 <= start_ts OR $2 >= end_ts) LIMIT 1`,
            [resourceId, start_ts, end_ts]
        );
        if (conflict.rowCount > 0) {
            return res.status(409).json({ error: 'time conflict' });
        }

        const insert = await db.query(
            `INSERT INTO bookings(resource_id,user_id,start_ts,end_ts,status) VALUES($1,$2,$3,$4,'confirmed') RETURNING *`,
            [resourceId, req.user.id, start_ts, end_ts]
        );

        const booking = insert.rows[0];

        // Notify via Socket.IO
        notifyResource(resourceId, 'booking.created', booking);

        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    } finally {
        // release lock
        const cur = await redisClient.get(lockKey);
        if (cur === lockToken) {
            await redisClient.del(lockKey);
        }
    }
});

module.exports = router;
