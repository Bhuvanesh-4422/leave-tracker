import dotenv from 'dotenv';
dotenv.config();

const client_id = process.env.ZOHO_CLIENT_ID;
const client_secret = process.env.ZOHO_CLIENT_SECRET;
const zoho_url=process.env.ZOHO_TOKEN_URL;
const form_refresh_token=process.env.FORM_REFRESH_TOKEN;
const leave_refresh_token=process.env.LEAVE_REFRESH_TOKEN;
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