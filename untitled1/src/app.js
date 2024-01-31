import pkg from '@slack/bolt';
import dotenv from 'dotenv';
import {send_leave_details} from "./handlers/leaveHandlers.js";
import{handle_apply_leave_modal,handle_leave_option_select,handle_apply_leave,handle_response_modal} from "./handlers/applyLeaveHandlers.js";

dotenv.config();

const { App } = pkg;
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGING_SECRET,
});
// ...
// Function to generate a unique session ID
export function generateSessionId(user_id) {
    return user_id;
}

// Command handling
app.command('/leave_details', async ({ ack, body,client,context }) => {
    await ack();
    await send_leave_details(app, body.user_id);
});

app.command('/apply_leave', async ({ ack, body, client,context }) => {
    await ack();
    await handle_apply_leave(app, ack, body, client,context);
});

// View handling
app.view('apply_leave_modal', async ({ ack, body, view, client,context }) => {
    await ack();

    // const sessionId = sessions[body.user.id];
    // context.sessionId = sessionId;
    await handle_apply_leave_modal(app, ack, body, view, client,context);
});

app.action(/leave_option_select_.*/, async ({ ack, body, action, client,context }) => {
    await ack();
    // const sessionId = sessions[body.user.id];
    // context.sessionId = sessionId;
    await handle_leave_option_select(app, ack, body, action, client,context);
});

app.view('action', async ({ ack, body, view, client,context }) => {
    await ack();
    // const sessionId = sessions[body.user.id];
    // context.sessionId = sessionId;
    await handle_response_modal(ack, body, client,context);
});

// Start the app
app.start(3000).then(() => {
    console.log('⚡️ Bolt app is running!');
});
export default app;