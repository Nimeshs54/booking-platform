// This worker is intentionally minimal. In production, use BullMQ or Sidekiq style worker.
const Redis = require('redis');
const redis = Redis.createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);

async function run() {
  console.log('worker started');
  // example: listen for a key and process - simplified
  redis.subscribe('bookings:notifications', message => {
    console.log('notification', message);
    // send email etc.
  });
}

run().catch(console.error);
