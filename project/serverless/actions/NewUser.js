import {INSERT_USER} from "../query/users.js";
export const NewUserHandler = async (event) => {
    try {
        const { name , email , username} = JSON.parse(event.body).input;

        const hasuraEndpoint = process.env.HASURA_ENDPOINT;

        const graphqlVariables = {
            name : name , email : email , username: username
        };

        const response = await fetch(hasuraEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ACCESS,
            },
            body: JSON.stringify({
                operationName: 'InsertUser', // Specify the operation name
                variables: graphqlVariables,
                query: INSERT_USER,
            }),
        });

        const responseData = await response.json();

        console.log('Hasura Response:', responseData);

        if (responseData.errors) {
            const uniqueConstraintError = responseData.errors.find(error => error.extensions.code === 'constraint-violation');

            if (uniqueConstraintError) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Username already exists.",
                    }),
                };
            }
            return {
                statusCode: 500,
                body: JSON.stringify({
                    errors: responseData.errors,
                }),
            };
        }

        if (responseData.data.insert_users.affected_rows !== 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "success",
                }),
            };
        } else {
            return {
                body: JSON.stringify({
                    responseData
                })
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