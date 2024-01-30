import applyLeave from "./applyLeave.js";

const leave_count_mapping={'Full_day':{'value':1},'First_Half':{'value':0.5,'session':1},'Second_Half':{'value':0.5,'session':2}}
function formatDateString(rawDate) {
    const dateObject = new Date(rawDate);

    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
}


let leave_obj={}
async function inputData(leave_format) {
    try {
        const emp_zoho_id = leave_format.email
        const leavetypeID = leave_format.leave_type
        const selecteDates=leave_format.days.options;
        const daysObject = {};

        selecteDates.forEach(selectedDate => {
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


        const input_data = {
            'Employee_ID': emp_zoho_id,
            'Leavetype': leavetypeID,
            'From': formatDateString(leave_format.from_date),
            'To': formatDateString(leave_format.to_date),
            'days': daysObject
        };
        leave_obj=input_data;
        console.log(leave_obj,'h')
        console.log(input_data,'l')

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    const response=await applyLeave(leave_obj);
    return response ;
}


export default inputData