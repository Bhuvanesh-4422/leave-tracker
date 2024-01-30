import Ioredis from "ioredis";
import axios from "axios";
import { refresh_token_forms } from "./accessToken.js";

const redis = new Ioredis();

await refresh_token_forms();

async function applyLeave(input_data) {
    try {
        console.log(input_data,"hhh")
        let token = await redis.get('access_token_key_forms');
        const baseUrl = 'https://people.zoho.com/people/api/forms/json/leave/insertRecord';
        const zohoToken = `Zoho-oauthtoken ${token}`;

        const constructUrl = () => {
            const queryParams = encodeURIComponent(JSON.stringify(input_data));
            return `${baseUrl}?inputData=${queryParams}`;
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': zohoToken
        };

        const url = constructUrl();
        const response = await axios.post(url, {}, { headers });
        const data = response.data;
        if (data.response.errors) {
            return data.response.errors.message.From;
        } else {
            return data.response.message;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

}

export default applyLeave;
