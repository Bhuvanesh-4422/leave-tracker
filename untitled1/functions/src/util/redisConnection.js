
import Ioredis from 'ioredis';

const redis = new Ioredis();

const connectToRedis = () => {
    return redis;
};

const disconnectFromRedis = () => {
    redis.disconnect();
};

export { connectToRedis, disconnectFromRedis };
