require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const { init: initSocket } = require('./socket');
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ai', aiRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
