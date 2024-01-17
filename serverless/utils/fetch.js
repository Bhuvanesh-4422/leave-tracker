export const fetchDataFromHasura = async (graphqlVariables, query) => {
    const hasuraEndpoint = process.env.HASURA_ENDPOINT;

    const response = await fetch(hasuraEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ACCESS,
        },
        body: JSON.stringify({
            variables: graphqlVariables,
            query: query,
        }),
    });

    const responseData = await response.json();
    console.log('Hasura Response:', responseData);

    return { responseData };
};
