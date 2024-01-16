export const postEvents = async (event) => {
    const eventPayload = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: ["new post", eventPayload.event.data.new.data] }),
    };
}

export const updateEvent = async (event) => {
    const eventPayload = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify( {message: eventPayload.event.data.new.data + " post changed to " + eventPayload.event.data.new.data }),
        };
}