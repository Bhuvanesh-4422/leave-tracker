import {USER_ID} from "../query/users.js";

export const useridHandler = async (event) => {
    try {
        const { username } = JSON.parse(event.body).input;

        const hasuraEndpoint =process.env.HASURA_ENDPOINT;

        const graphqlVariables = {
            username: username,
        };

        const response = await fetch(hasuraEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ACCESS
            },
            body: JSON.stringify({
                query: USER_ID,
                variables: graphqlVariables,
            }),
        });

        const result = await response.json();

        const userId = result.data.users[0]?.id;

        if (!userId) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found'
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                    Id:userId,
            }),
        };
    } catch (error) {
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
};