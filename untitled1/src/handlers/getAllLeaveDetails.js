import axios from 'axios';
import getEmployeeDetails from "./searchForEmployee.js";
import {leave_token} from './token.js'

async function getUserReportByEmail(empId) {
    try {
        const zoho_id=await getEmployeeDetails(empId)
        const apiUrl = `https://people.zoho.com/people/api/v2/leavetracker/reports/user?employee=${zoho_id}`;
        const headers = {
            Authorization: `Zoho-oauthtoken ${leave_token}`,
        };

        const response = await axios.get(apiUrl, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export default getUserReportByEmail ;