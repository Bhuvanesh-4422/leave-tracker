export const test = async (event) => {
    try {
        const { user_id } = JSON.parse(event.body).input;

        const hasuraEndpoint ='http://project-graphql-engine-1:8080/v1/graphql';
        const graphqlQuery = `
            query MyQuery($user_id: Int) {
            contact(where: {user_id: {_eq: $user_id}}) {
            contact
            }
        }
        `;

        const graphqlVariables = {
            user_id: user_id,
        };

        const response = await fetch(hasuraEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': 'password'
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: graphqlVariables,
            }),
        });

        const result = await response.json();

        const contact = result.data.contact;

        if (!contact) {
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
                contact:contact,
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