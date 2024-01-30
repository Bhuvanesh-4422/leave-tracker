const client_id = '1000.VSUZN1SFCSA9FHI6MWW3H0SRSDSXCR';
const client_secret = 'b6c0a35f8e64b7638dd0a6e40a1727c8f63e3b37d6';
const zoho_url='https://accounts.zoho.com/oauth/v2/token'
const form_refresh_token='1000.97e539e9d696d9481c1abea228049956.36449c8b87464c0d9ef0e9524514865f'
const leave_refresh_token='1000.56f0c8a603de3c1df7612d879d2b7629.ae57e7e22b920faf94d167a984ce0351'

const refresh_token_config_form = {
    refresh_token: form_refresh_token,
    redis_key: 'access_token_key_forms',
    client_id:client_id,
    client_secret:client_secret,
    zoho_url:zoho_url
};

const refresh_token_config_leave = {
    refresh_token: leave_refresh_token,
    redis_key: 'access_token_key_leave',
    client_id:client_id,
    client_secret:client_secret,
    zoho_url:zoho_url
};
export {refresh_token_config_leave,refresh_token_config_form}