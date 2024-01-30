import Ioredis from "ioredis";
import axios from "axios";
import {form_token} from "./tokens.js";
async function applyLeave(input_data) {
    try {

        const base_url = 'https://people.zoho.com/people/api/forms/json/leave/insertRecord';
        const zoho_token = `Zoho-oauthtoken ${form_token}`;
        const constructUrl = () => {
            const queryParams = encodeURIComponent(JSON.stringify(input_data));
            return `${base_url}?inputData=${queryParams}`;
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': zoho_token
        };
        const url = constructUrl();
        const response = await axios.post(url, {}, { headers });
        const data = response.data;

    } catch (error) {
        console.error('Error:', error.message);
    }

}

export default applyLeave;
