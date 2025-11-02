const express = require('express');
const Stripe = require('stripe');
const db = require('../db');
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET || 'sk_test_replace');

// create payment intent for a booking
router.post('/create-intent', async (req, res) => {
    const { bookingId, amountCents, currency = 'usd' } = req.body;
    if (!bookingId || !amountCents) return res.status(400).json({ error: 'missing params' });

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency,
            metadata: { bookingId }
        });

        // persist payment record
        await db.query(
            `INSERT INTO payments(booking_id, stripe_payment_id, amount_cents, currency, status) VALUES($1,$2,$3,$4,$5)`,
            [bookingId, paymentIntent.id, amountCents, currency, 'pending']
        );

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'stripe error' });
    }
});

module.exports = router;
