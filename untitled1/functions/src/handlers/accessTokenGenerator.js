import axios from 'axios';
import { connectToRedis, disconnectFromRedis } from '../util/redisConnection.js';
const redis = connectToRedis();

const createTokenRefresher = (config) => {
    const { refreshToken: refresh_token, redisKey: redis_key } = config;
    const client_id = '1000.VSUZN1SFCSA9FHI6MWW3H0SRSDSXCR';
    const client_secret = 'b6c0a35f8e64b7638dd0a6e40a1727c8f63e3b37d6';

    return async () => {
        try {
            const current_token = await redis.get(redis_key);
            if (!current_token) {
                const response = await axios.post(
                    'https://accounts.zoho.com/oauth/v2/token',
                    new URLSearchParams({
                        refresh_token: refresh_token,
                        client_id: client_id,
                        client_secret: client_secret,
                        grant_type: 'refresh_token',
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                const new_token = response.data.access_token;
                const new_expiration = 3480;

                await redis.set(redis_key, new_token, 'EX', new_expiration);

                console.log('Token refreshed:', new_token);
            } else {
                console.log('Token still valid. No refresh needed.');
            }
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        }
    };
};

export { createTokenRefresher };
