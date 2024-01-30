import getUserReportByEmail from "./getAllLeaveDetails.js";
import {get_user_info} from "../util/getSlackEmail.js";
export async function send_leave_details(app, user_id) {
    try {
        // Get user email
        const email = await get_user_info(user_id);

        // Get leave details
        const leave_details = await getUserReportByEmail(email);
        const { employeeName, leavetypes } = leave_details;
        const blocks = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Leave Details for ${employeeName}*`,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: 'Leave Type',
                    },
                    {
                        type: 'mrkdwn',
                        text: 'Available | Taken',
                    },
                ],
            },
        ];

        leavetypes.forEach((leave_type) => {
            blocks.push({
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*${leave_type.leavetypeName}*`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `\`${leave_type.available}\`\u2003|\u2003\`${leave_type.taken}\``,
                    },
                ],
            });
        });

        // Send the message with Block Kit syntax to Slack
        await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: user_id,
            blocks: blocks,
        });
    } catch (error) {
        console.error(error);
    }
}
