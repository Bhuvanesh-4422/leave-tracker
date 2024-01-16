import {DELETE_USER} from "../query/users.js";

export const deleteUserHandler = async (event) => {
    try {
        const { id } = JSON.parse(event.body).input;

        const hasuraEndpoint = process.env.HASURA_ENDPOINT;

        const graphqlVariables = {
            id: parseInt(id),
        };

        const response = await fetch(hasuraEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ACCESS,
            },
            body: JSON.stringify({
                operationName: 'Deleteuser', // Specify the operation name
                variables: graphqlVariables,
                query: DELETE_USER,
            }),
        });

        const responseData = await response.json();

        console.log('Hasura Response:', responseData);

        if (responseData.data.delete_users.affected_rows!=0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "success",
                }),
            };
        } else {
            console.error('Hasura Error:', responseData);
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    message:"user not found"
                }),
            };
        }
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