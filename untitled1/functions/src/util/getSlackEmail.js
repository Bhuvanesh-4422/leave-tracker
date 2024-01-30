import app from "../app.js";
export async function get_user_info(user_id) {
    try {
        const user_info = await app.client.users.info({
            token: process.env.SLACK_BOT_TOKEN,
            user: user_id,
        });
        const user_email = user_info.user.profile.email;
        console.log(user_email);
        return user_email;
    } catch (error) {
        console.error('Error fetching user information:', error);
        return null;
    }
}
