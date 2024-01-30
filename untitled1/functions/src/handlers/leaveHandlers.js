import getUserReportByEmail from "./getAllLeaveDetails.js";
import {get_user_info} from "../util/getSlackEmail.js";
export async function send_leave_details(app,user_id) {
    const email = await get_user_info(app,user_id);

    const leave_details = await getUserReportByEmail(email)

    const { employeeName, leavetypes } = leave_details;

    let message = `Leave details for ${employeeName}:\n`;
    leavetypes.forEach((leave_type) => {
        message += `\n${leave_type.leavetypeName}:\n  - Available: ${leave_type.available}\n  - Taken: ${leave_type.taken}\n`;
    });

    try {
        await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: user_id,
            text: message,
        });
    } catch (error) {
        console.error(error);
    }
}
