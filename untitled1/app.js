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
const date_schema = Joi.date().iso().required();

function is_date_greater_than_today(date_string) {
    const current_date = new Date();
    const input_date = new Date(date_string);

    return input_date > current_date;
}

app.message('apply', async ({ message, say }) => {
    const text = message.text;
    const match = text.match(regex);

    if (match && match.length >= 3) {
        const [_, from_date, to_date] = match;

        // Parse date strings into ISO format
        const iso_from_date = new Date(from_date).toISOString();
        const iso_to_date = new Date(to_date).toISOString();

        const from_date_validation = date_schema.validate(iso_from_date);
        const to_date_validation = date_schema.validate(iso_to_date);

        if (from_date_validation.error || to_date_validation.error) {
            await say({
                text: 'Invalid date format. Please use the format MM/DD/YYYY.',
            });
        } else if (!is_date_greater_than_today(iso_from_date) || !is_date_greater_than_today(iso_to_date)) {
            await say({
                text: 'Leave dates must be in the future.',
            });
        } else if (iso_from_date > iso_to_date) {
            await say({
                text: 'End date must be greater than the start date.',
            });
        } else {
            await say({
                text: `Leave application received from <@${message.user}>. From: ${from_date}, To: ${to_date}`,
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
