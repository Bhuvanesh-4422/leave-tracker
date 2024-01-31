function formatDateString(rawDate) {
    const dateObject = new Date(rawDate);

    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
}
export default formatDateString