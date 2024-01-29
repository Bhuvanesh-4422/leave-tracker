import axios from 'axios';
import Ioredis from 'ioredis';
import {refresh_token_forms} from "./accessToken.js"

const redis = new Ioredis();


await refresh_token_forms();

async function getEmployeeDetails(emp_email_id) {
    try {

        const token = await redis.get('access_token_key_forms');
        const apiUrl = 'https://people.zoho.com/api/forms/employee/getRecords';
        const searchColumn = 'EMPLOYEEMAILALIAS';
        const searchValue = emp_email_id;
        const headers = {
            Authorization: `Zoho-oauthtoken ${token}`,
        };
        const response = await axios.get(apiUrl, {
            headers,
            params: {
                searchColumn,
                searchValue,
            },
        });
        const result=response.data.response.result[0]
        const first_key=Object.keys(result)
        return  first_key[0]

    } catch (error) {
        console.error('Error:', error.message,"this,,,");
    }
}


export default getEmployeeDetails
