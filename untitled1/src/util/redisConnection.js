import Ioredis from 'ioredis';

const redis = new Ioredis();

const connectToRedis = () => {
    return redis;
};

const disconnectFromRedis = () => {
    redis.disconnect();
};

const getAccessToken = async (key) => {
    return redis.get(key);
};

const setAccessToken = async (key, value, expiration) => {
    await redis.set(key, value, 'EX', expiration);
};

export { connectToRedis, disconnectFromRedis, getAccessToken, setAccessToken };