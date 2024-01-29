import pkg from '@slack/bolt';
import dotenv from 'dotenv';
import {prepareLeaveDetails , prepareLeaveDays} from "./index.js";

dotenv.config();
const { App } = pkg;
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGING_SECRET,
});
const leaves_format={'email':null,'leave_type':null,'from_date':null,'to_date':null,'days':null}
const leaveDetails = {
    employee_name: "pranav N",
    leave_types: [
        {
            unit: "Day",
            taken: 0,
            leave_type_name: "Bereavement leave",
            available: 0,
            type: "PAID",
            leave_type_id: 790031000000254578,
        },
    ],
    employee_id: "1",
};

async function get_user_info(user_id) {
    try {
        const user_info = await app.client.users.info({ user: user_id });
        const user_email = user_info.user.profile.email;
        console.log(user_email);
        return user_email;
    } catch (error) {
        console.error('Error fetching user information:', error);
        return null;
    }
}

async function send_leave_details(user_id) {
    const email = get_user_info(user_id);
    const { employee_name, leave_types } = leaveDetails;

    let message = `Leave details for ${employee_name}:\n`;
    leave_types.forEach((leave_type) => {
        message += `\n${leave_type.leave_type_name}:\n  - Available: ${leave_type.available}\n  - Taken: ${leave_type.taken}\n`;
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

// Function to generate an array of dates between two given dates
app.command('/leave_details', async ({ ack, body }) => {
    await ack();
    console.log(body);
    send_leave_details(body.user_id);
});

app.command('/apply_leave', async ({ ack, body, client }) => {
    await ack();

    try {
        // Open a modal with two datepickers for "from" and "to" dates
        const open_result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                callback_id: 'apply_leave_modal',
                title: {
                    type: 'plain_text',
                    text: 'Apply Leave',
                },
                blocks: [
                    {
                        type: 'section',
                        block_id: 'from_date_section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Pick a from date:',
                        },
                        accessory: {
                            type: 'datepicker',
                            action_id: 'from_date',
                            placeholder: {
                                type: 'plain_text',
                                text: 'Select a date',
                            },
                        },
                    },
                    {
                        type: 'section',
                        block_id: 'to_date_section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Pick a to date:',
                        },
                        accessory: {
                            type: 'datepicker',
                            action_id: 'to_date',
                            placeholder: {
                                type: 'plain_text',
                                text: 'Select a date',
                            },
                        },
                    },
                    {
                        type: 'section',
                        block_id: 'leave_type_section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Select leave type:',
                        },
                        accessory: {
                            type: 'static_select',
                            action_id: 'leave_type',
                            placeholder: {
                                type: 'plain_text',
                                text: 'Select leave type',
                            },
                            options: [
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Bereavement leave',
                                    },
                                    value: '790031000000254578',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Compensatory Off',
                                    },
                                    value: '790031000000247016',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Holidays',
                                    },
                                    value: '790031000000247072',
                                },
                            ],
                        },
                    },
                ],
                submit: {
                    type: 'plain_text',
                    text: 'Submit',
                },
            },
        });
        console.log('Open Modal Result:', open_result);
    } catch (error) {
        console.error('Error opening modal:', error);
    }
});

app.view('apply_leave_modal', async ({ ack, body, view, client }) => {
    try {
        // Acknowledge the view submission
        await ack();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Extract the selected dates from the submitted view
        const from_date = new Date(view.state.values.from_date_section.from_date.selected_date);
        const to_date = new Date(view.state.values.to_date_section.to_date.selected_date);
        const leave_type = view.state.values.leave_type_section.leave_type.selected_option.value;
        const email = get_user_info(body.user.id);
        leaves_format.email=email
        leaves_format.leave_type=leave_type
        leaves_format.to_date=to_date
        leaves_format.from_date=from_date

        // Define a constant to store option values for each day
        prepareLeaveDetails(email,leave_type,from_date,to_date)
        //prepareLeaveDetails(email,leave_type,from_date,to_date)
        const leave_options_by_date = {};
        const blocks = [
            {
                type: 'section',
                block_id: 'selected_dates',
                text: {
                    type: 'mrkdwn',
                    text: `Selected Dates:\nFrom: ${from_date.toDateString()}\nTo: ${to_date.toDateString()}`,
                },
            },
        ];

        // Add a section for each day with options for full day or half day leave
        const current_date = new Date(from_date);
        while (current_date <= to_date) {
            const date_key = current_date.toISOString().split('T')[0];
            leave_options_by_date[date_key] = [
                {
                    text: {
                        type: 'plain_text',
                        text: 'Full Day',
                    },
                    value: 'Full_day',
                },
                {
                    text: {
                        type: 'plain_text',
                        text: 'First Half',
                    },
                    value: 'First_Half',
                },
                {
                    text: {
                        type: 'plain_text',
                        text: 'Second Half',
                    },
                    value: 'Second_Half',
                },
            ];

            blocks.push({
                type: 'section',
                block_id: `leave_option_${current_date}`,
                text: {
                    type: 'mrkdwn',
                    text: `*${current_date.toDateString()}*\nChoose leave option:`,
                },
                accessory: {
                    type: 'static_select',
                    action_id: `leave_option_select_${current_date}`,
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select leave option',
                    },
                    options: leave_options_by_date[date_key],
                },
            });

            current_date.setDate(current_date.getDate() + 1);
        }

        const open_result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                callback_id: 'apply_leave_modal',
                title: {
                    type: 'plain_text',
                    text: 'Leave Details',
                },
                blocks,
                close: {
                    type: 'plain_text',
                    text: 'Close',
                },
            },
        });

    } catch (error) {
        console.error('Error handling view submission:', error);
    }
});

// Listen for block actions (selections from static select menus)
app.action(/leave_option_select_.*/, async ({ ack, body, action, client }) => {
    await ack();

    const date = action.action_id.replace('leave_option_select_', '');
    const selected_option = action.selected_option.value;
    const dateAndOption = {
        date: date,
        selected_option: selected_option
    };
    console.log(dateAndOption);
    leaves_format.days=dateAndOption
    console.log(leaves_format)

});

app.start(3000).then(() => {
    console.log('⚡️ Bolt app is running!');
});
