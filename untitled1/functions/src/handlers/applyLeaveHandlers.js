import {get_user_info} from "../util/getSlackEmail.js";
import {leaves_format} from "../config/leaveFormat.js";
import inputData from "./formatedData.js";
import getEmployeeDetails from "./searchForEmployee.js";
export async function handle_apply_leave(app, ack, body, client) {

    try {
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
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Vacation',
                                    },
                                    value: '790031000000247060',
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
}

const dayss={'options':[]}
export async function handle_apply_leave_modal(app, ack, body, view, client) {
    try {
        // Acknowledge the view submission

        await new Promise(resolve => setTimeout(resolve, 1000));

        dayss.options = [];

        const from_date = new Date(view.state.values.from_date_section.from_date.selected_date);
        const to_date = new Date(view.state.values.to_date_section.to_date.selected_date);
        const leave_type = view.state.values.leave_type_section.leave_type.selected_option.value;
        const email = await get_user_info(body.user.id);
        console.log(from_date,to_date,email,leave_type)
        leaves_format.email=await getEmployeeDetails(email)
        // leaves_format.email=email
        leaves_format.leave_type=leave_type
        leaves_format.to_date=to_date
        leaves_format.from_date=from_date

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
                callback_id: 'action',
                title: {
                    type: 'plain_text',
                    text: 'Leave Details',
                },
                blocks,
                submit: {
                    type: 'plain_text',
                    text: 'submit',
                },
            },
        });

    } catch (error) {
        console.error('Error handling view submission:', error);
    }
}

export async function handle_leave_option_select(app, ack, body, action, client) {


    const date = action.action_id.replace('leave_option_select_', '');
    const selected_option = action.selected_option.value;
    const dateAndOption = {
        date: date,
        selected_option: selected_option
    };

    console.log(dateAndOption,"jjjjjj");
    dayss.options.push(dateAndOption);
    leaves_format.days=dayss
    console.log(leaves_format)
}

export async function handle_response_modal(ack, body, client) {
    try {

        const response = await inputData(leaves_format);

        const messageBlocks = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Response:* ${await response}`
                }
            }
            // Add more blocks if needed
        ];

        // Open a new view with the response message
        await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                callback_id: 'response_modal',
                title: {
                    type: 'plain_text',
                    text: 'Response',
                },
                blocks: messageBlocks,
                close: {
                    type: 'plain_text',
                    text: 'Close',
                },
            },
        });

    } catch (error) {
        console.error('Error handling view submission:', error);
    }
}