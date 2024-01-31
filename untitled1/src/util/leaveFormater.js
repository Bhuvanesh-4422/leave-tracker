import formatDateString from "../util/dateFormater.js";
import getEmployeeDetails from "../handlers/searchForEmployee.js";
const leave_count_mapping = {
    'Full_day': { 'value': 1 },
    'First_Half': { 'value': 0.5, 'session': 1 },
    'Second_Half': { 'value': 0.5, 'session': 2 }
};
const transformLeaveFormat = async (leaveFormat) => {
    try {
        const emp_zoho_id = await getEmployeeDetails(leaveFormat.leaves_format.email);
        const leavetypeID = leaveFormat.leaves_format.leave_type;
        const selectedDates = leaveFormat.days_and_options;
        const daysObject = {};

        selectedDates.forEach(selectedDate => {
            const formattedDate = formatDateString(selectedDate.date);

            const leaveCount = leave_count_mapping[selectedDate.selected_option].value;
            const session = leave_count_mapping[selectedDate.selected_option].session;

            if (!daysObject[formattedDate]) {
                daysObject[formattedDate] = {};
            }

            daysObject[formattedDate]['LeaveCount'] = leaveCount;
            if (selectedDate.selected_option !== 'Full_day') {
                daysObject[formattedDate]['Session'] = session;
            }
        });

        return {
            'Employee_ID': emp_zoho_id,
            'Leavetype': leavetypeID,
            'From': formatDateString(leaveFormat.leaves_format.from_date),
            'To': formatDateString(leaveFormat.leaves_format.to_date),
            'days': daysObject
        };
    } catch (error) {
        console.error('Error in transformLeaveFormat:', error.message);
        throw error;
    }
};

export { transformLeaveFormat };