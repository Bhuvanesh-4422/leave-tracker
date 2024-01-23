import pkg from '@slack/bolt';
const { App } = pkg;

import dotenv from 'dotenv';
import Joi from "joi";

dotenv.config();

const app = new App({
    token: process.env.SLACK_TOKEN,
    signingSecret: process.env.SLACK_SIGING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});
const regex = /apply leave from (\d{2}\/\d{2}\/\d{4}) to (\d{2}\/\d{2}\/\d{4})/;
const dateSchema = Joi.date().iso().required();

function isDateGreaterThanToday(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    return inputDate > currentDate;
}
app.message('apply', async ({ message, say }) => {
    const text = message.text;
    const match = text.match(regex);

    if (match && match.length >= 3) {
        const [_, fromDate, toDate] = match;

        // Parse date strings into ISO format
        const isoFromDate = new Date(fromDate).toISOString();
        const isoToDate = new Date(toDate).toISOString();

        const fromDateValidation = dateSchema.validate(isoFromDate);
        const toDateValidation = dateSchema.validate(isoToDate);

        if (fromDateValidation.error || toDateValidation.error) {
            await say({
                text: 'Invalid date format. Please use the format MM/DD/YYYY.',
            });
        } else if (!isDateGreaterThanToday(isoFromDate) || !isDateGreaterThanToday(isoToDate)) {
            await say({
                text: 'Leave dates must be in the future.',
            });
        } else if (isoFromDate > isoToDate) {
            await say({
                text: 'End date must be greater than the start date.',
            });
        }   else {
            await say({
                text: `Leave application received from <@${message.user}>. From: ${fromDate}, To: ${toDate}`,
            });
        }
    } else {
        await say({
            text: 'Invalid date range. Please use the format MM/DD/YYYY.',
        });
    }
});
(async () => {
    await app.start(3000);
    console.log('Bolt app is running!');
})();