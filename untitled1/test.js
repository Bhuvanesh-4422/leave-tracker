import getUserReportByEmail from "./getAllLeaveDetails.js";
const leavedetails = await getUserReportByEmail("22f2000117@ds.study.iitm.ac.in")
console.log(leavedetails)
