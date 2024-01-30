import axios from 'axios';
import getEmployeeDetails from "./searchForEmployee.js";
import {leave_token} from "./tokens.js";

async function getUserReport(empId) {
    try {
        const apiUrl = `https://people.zoho.com/people/api/v2/leavetracker/reports/user?employee=${empId}`;
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