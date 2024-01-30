import { createTokenRefresher } from '../handlers/accessTokenGenerator.js';

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

export { refresh_token_forms, refresh_token_leave };
