import axios from 'axios';
import { connectToRedis,getAccessToken,setAccessToken } from './redisConnection.js';
const redis = connectToRedis();

const createTokenRefresher = (config) => {
    const { refresh_token: refresh_token, redis_key: redis_key ,client_id:client_id,client_secret:client_secret,zoho_url:zoho_url} = config;
    return async () => {
        try {
            const current_token =await getAccessToken(redis_key)
            if (!current_token) {
                const response = await axios.post(
                    zoho_url,
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
                await setAccessToken(redis_key,new_token,new_expiration)

                return new_token
            } else {
                console.log('Token still valid. No refresh needed.');
                return current_token
            }
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        }
    };
};

export { createTokenRefresher };
