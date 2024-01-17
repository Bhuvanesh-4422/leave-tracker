// newUserHandler.js

import { insertUser} from "../models/new_user.js";

export const NewUserHandler = async (event) => {
    try {
        const { name, email, username } = JSON.parse(event.body).input;

        try {
            const success = await insertUser({ name, email, username });

            if (success) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "success",
                    }),
                };
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: "Failed to insert user.",
                    }),
                };
            }
        } catch (error) {
            if (error.message === 'Username already exists.') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: error.message,
                    }),
                };
            }

            // Handle other errors here if needed

            console.error('Error processing Hasura Action:', error);

            return {
                statusCode: 500,
                body: JSON.stringify({
                    errors: [{
                        message: 'Internal Server Error'
                    }],
                }),
            };
        }
    } catch (error) {
        console.error('Error parsing input:', error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                errors: [{
                    message: 'Invalid input format'
                }],
            }),
        };
    }
};
