import { deleteUser} from "../models/delete_user.js";

const handleResponse = (success) => {
    if (success) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "success",
            }),
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "user not found"
            }),
        };
    }
};

export const deleteUserHandler = async (event) => {
    try {
        const { id } = JSON.parse(event.body).input;
        const success = await deleteUser(id);
        return handleResponse(success);
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