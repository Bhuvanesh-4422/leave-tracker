import { fetchDataFromHasura } from "../utils/fetch.js";
import { INSERT_USER } from "../query/users.js";

export const insertUser = async ({ name, email, username }) => {
    const graphqlVariables = {
        name: name,
        email: email,
        username: username
    };

    try {
        const { responseData } = await fetchDataFromHasura(graphqlVariables, INSERT_USER);

        if (responseData.errors) {
            const uniqueConstraintError = responseData.errors.find(error => error.extensions.code === 'constraint-violation');

            if (uniqueConstraintError) {
                throw new Error('Username already exists.');
            }

            throw new Error('Hasura error'); // You can customize this error message based on your needs
        }

        return responseData.data.insert_users.affected_rows !== 0;
    } catch (error) {
        console.error('Error processing Hasura Action:', error);
        throw error;
    }
};
