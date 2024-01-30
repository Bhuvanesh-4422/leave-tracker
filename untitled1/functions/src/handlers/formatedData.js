import applyLeave from './applyLeave.js';
import { transformLeaveFormat } from "../util/leaveFormater.js";

let leave_obj = {};

async function inputData(leave_format) {
    try {
        const input_data = transformLeaveFormat(leave_format);
        leave_obj = input_data;
        console.log(leave_obj);
        console.log(input_data);
    } catch (error) {
        console.error('Error in inputData:', error.message);
        throw error;
    }

    console.log(leave_obj);
    await applyLeave(leave_obj);
}

export default inputData;
