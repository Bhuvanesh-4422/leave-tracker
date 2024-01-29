import axios from "axios";
import Ioredis from "ioredis";

const redis = new Ioredis();

const createTokenRefresher = (config) => {
    const { refreshToken: refresh_token, redisKey: redis_key } = config;
    const client_id = '1000.VSUZN1SFCSA9FHI6MWW3H0SRSDSXCR';
    const client_secret = 'b6c0a35f8e64b7638dd0a6e40a1727c8f63e3b37d6';

    return async () => {
        try {
            const current_token = await redis.get(redis_key);
            const expiration_time = await redis.ttl(redis_key);

            if (!current_token || expiration_time < 120) {
                const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', new URLSearchParams({
                    refresh_token: refresh_token,
                    client_id: client_id,
                    client_secret: client_secret,
                    grant_type: 'refresh_token',
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const newToken = response.data.access_token;
                const newExpiration = response.data.expires_in;

                await redis.set(redis_key, newToken, 'EX', newExpiration);

                console.log('Token refreshed:', newToken);
            } else {
                console.log('Token still valid. No refresh needed.');
            }
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        }
    };
};


const refresh_token_config_form = {
    refreshToken: '1000.97e539e9d696d9481c1abea228049956.36449c8b87464c0d9ef0e9524514865f',
    redisKey: 'access_token_key_forms',
};

const refresh_token_config_leave = {
    refreshToken: '1000.56f0c8a603de3c1df7612d879d2b7629.ae57e7e22b920faf94d167a984ce0351',
    redisKey: 'access_token_key_leave',
};

const refresh_token_forms = createTokenRefresher(refresh_token_config_form);
const refresh_token_leave = createTokenRefresher(refresh_token_config_leave);

export {refresh_token_forms,refresh_token_leave}