import axios from 'axios';
import {form_token} from "./tokens.js";
async function getEmployeeDetails(emp_email_id) {
    try {
        const apiUrl = 'https://people.zoho.com/api/forms/employee/getRecords';
        const searchColumn = 'EMPLOYEEMAILALIAS';
        const searchValue = emp_email_id;
        const headers = {
            Authorization: `Zoho-oauthtoken ${form_token}`,
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
