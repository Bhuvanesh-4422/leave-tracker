import { fetchDataFromHasura } from "../utils/fetch.js";
import { DELETE_USER } from "../query/users.js";

export const deleteUser = async (id) => {
    const graphqlVariables = {
        id: parseInt(id),
    };

    try {
        const { responseData } = await fetchDataFromHasura(graphqlVariables, DELETE_USER);
        return responseData.data && responseData.data.delete_users && responseData.data.delete_users.affected_rows !== 0;
    } catch (error) {
        console.error('Error processing Hasura Action:', error);
        throw error;
    }
};
