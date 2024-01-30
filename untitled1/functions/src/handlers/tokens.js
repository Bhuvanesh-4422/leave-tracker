import { createTokenRefresher } from '../util/accessTokenGenerator.js';
import {disconnectFromRedis} from "../util/redisConnection.js";
import {refresh_token_config_leave,refresh_token_config_form} from "../config/tokenConfig.js";

const refresh_token_forms = createTokenRefresher(refresh_token_config_form);
const refresh_token_leave = createTokenRefresher(refresh_token_config_leave);


const form_token=await refresh_token_forms();
const leave_token =await refresh_token_leave();


disconnectFromRedis();
export {form_token,leave_token}