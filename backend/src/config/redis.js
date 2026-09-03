const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_KEY,
    socket: {
        host: 'triumphant-hyperradiant-suggestion-85018.db.redis.io',
        port: 17775
    }
});  


module.exports = redisClient ;