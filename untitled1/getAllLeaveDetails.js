import axios from 'axios';
import Ioredis from 'ioredis';
import { refresh_token_leave} from "./accessToken.js";
import getEmployeeDetails from "./searchForEmployee.js";

const redis = new Ioredis();

await refresh_token_leave();


async function getUserReport(empId) {
    try {
        const apiUrl = `https://people.zoho.com/people/api/v2/leavetracker/reports/user?employee=${empId}`;

        const accessToken = await redis.get("access_token_key_leave");

        const headers = {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
        };

        const response = await axios.get(apiUrl, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    } finally {
        // Disconnect from Redis in the finally block
        redis.disconnect();
    }
}


async function getUserReportByEmail(emailId) {
    try {
        const empId = await getEmployeeDetails(emailId);
        if (empId) {
            const userReport = await getUserReport(empId);
            return userReport;
        } else {
            throw new Error(`Employee ID not found for email: ${emailId}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

export default getUserReportByEmail ;
