export const INSERT_USER = `
    mutation InsertUser($email: String = "", $name: String = "", $username: String = "") {
        insert_users(objects: {email: $email, name: $name, username: $username}) {
                affected_rows
        }
    }
`;

export const USER_ID = `
            query GetUser($username: String!) {
                users(where: { username: { _eq: $username } }) {
                    id
                }
            }
        `;

export const DELETE_USER = `
            mutation Deleteuser($id: Int!) {
                delete_users(where: { id: { _eq: $id } }) {
                    affected_rows
                }
            }
        `;
