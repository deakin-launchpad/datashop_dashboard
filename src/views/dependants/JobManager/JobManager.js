/* eslint-disable react/prop-types */
// import { styled, alpha } from "@mui/material/styles";
// import { ViewState } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   DayView,
//   Appointments,
//   MonthView,
//   Toolbar,
//   DateNavigator,
//   ViewSwitcher,
//   TodayButton,
//   Resources,
//   AppointmentTooltip,
// } from "@devexpress/dx-react-scheduler-material-ui";
// import { indigo, blue, teal, red } from "@mui/material/colors";
// import Paper from "@mui/material/Paper";
// import classNames from "clsx";

// const PREFIX = "Demo";

// const classes = {
//   appointment: `${PREFIX}-appointment`,
//   successStatusAppointment: `${PREFIX}-successStatusAppointment`,
//   failedStatusAppointment: `${PREFIX}-failedStatusAppointment`,
//   runningStatusAppointment: `${PREFIX}-runningStatusAppointment`,
//   initiatedStatusAppointment: `${PREFIX}-initiatedStatusAppointment`,
//   weekEndCell: `${PREFIX}-weekEndCell`,
//   weekEndDayScaleCell: `${PREFIX}-weekEndDayScaleCell`,
//   text: `${PREFIX}-text`,
//   content: `${PREFIX}-content`,
//   container: `${PREFIX}-container`,
// };

// const StyledMonthViewDayScaleCell = styled(MonthView.DayScaleCell)(
//   ({ theme: { palette } }) => ({
//     [`&.${classes.weekEndDayScaleCell}`]: {
//       backgroundColor: alpha(palette.action.disabledBackground, 0.06),
//     },
//   })
// );

// const StyledMonthViewTimeTableCell = styled(MonthView.TimeTableCell)(
//   ({ theme: { palette } }) => ({
//     [`&.${classes.weekEndCell}`]: {
//       backgroundColor: alpha(palette.action.disabledBackground, 0.04),
//       "&:hover": {
//         backgroundColor: alpha(palette.action.disabledBackground, 0.04),
//       },
//       "&:focus": {
//         backgroundColor: alpha(palette.action.disabledBackground, 0.04),
//       },
//     },
//   })
// );

// const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
//   [`&.${classes.appointment}`]: {
//     borderRadius: 0,
//     borderBottom: 0,
//   },
//   [`&.${classes.successStatusAppointment}`]: {
//     borderLeft: `4px solid ${teal[500]}`,
//   },
//   [`&.${classes.failedStatusAppointment}`]: {
//     borderLeft: `4px solid ${red[500]}`,
//   },
//   [`&.${classes.runningStatusAppointment}`]: {
//     borderLeft: `4px solid ${blue[500]}`,
//   },
//   [`&.${classes.initiatedStatusAppointment}`]: {
//     borderLeft: `4px solid #999999`,
//   },
// }));

// const StyledAppointmentsAppointmentContent = styled(
//   Appointments.AppointmentContent
// )(() => ({
//   [`& .${classes.text}`]: {
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   [`& .${classes.content}`]: {
//     opacity: 0.7,
//   },
//   [`& .${classes.container}`]: {
//     width: "100%",
//     lineHeight: 1.2,
//     height: "100%",
//   },
// }));

// const appointments = [
//   {
//     title: "Prepare 2015 Marketing Plan",
//     startDate: new Date(2018, 5, 25, 13, 0),
//     endDate: new Date(2018, 5, 25, 13, 30),
//     status: 2,
//     location: "Room 3",
//   },
//   {
//     title: "Brochure Design Review",
//     startDate: new Date(2018, 5, 28, 14, 10),
//     endDate: new Date(2018, 5, 28, 15, 30),
//     status: 1,
//     location: "Room 1",
//   },
//   {
//     title: "Website Re-Design Plan",
//     startDate: new Date(2018, 5, 29, 9, 30),
//     endDate: new Date(2018, 5, 29, 11, 30),
//     status: 1,
//     location: "Room 3",
//   },
//   {
//     title: "Book Flights to San Fran for Sales Trip",
//     startDate: new Date(2018, 6, 2, 12, 0),
//     endDate: new Date(2018, 6, 2, 13, 0),
//     status: 3,
//     location: "Room 2",
//   },
//   {
//     title: "Install New Router in Dev Room",
//     startDate: new Date(2018, 6, 2, 14, 30),
//     endDate: new Date(2018, 6, 2, 15, 30),
//     status: 2,
//     location: "Room 3",
//   },
//   {
//     title: "Approve Personal Computer Upgrade Plan",
//     startDate: new Date(2018, 6, 4, 10, 0),
//     endDate: new Date(2018, 6, 4, 11, 0),
//     status: 1,
//     location: "Room 1",
//   },
//   {
//     title: "Final Budget Review",
//     startDate: new Date(2018, 6, 6, 12, 0),
//     endDate: new Date(2018, 6, 6, 13, 35),
//     status: 3,
//     location: "Room 1",
//   },
//   {
//     title: "New Brochures",
//     startDate: new Date(2018, 6, 6, 14, 30),
//     endDate: new Date(2018, 6, 6, 15, 45),
//     status: 3,
//     location: "Room 3",
//   },
//   {
//     title: "Install New Database",
//     startDate: new Date(2018, 6, 10, 9, 45),
//     endDate: new Date(2018, 6, 10, 11, 15),
//     status: 2,
//     location: "Room 2",
//   },
//   {
//     title: "Approve New Online Marketing Strategy",
//     startDate: new Date(2018, 6, 12, 12, 0),
//     endDate: new Date(2018, 6, 12, 14, 0),
//     status: 1,
//     location: "Room 2",
//   },
//   {
//     title: "Upgrade Personal Computers",
//     startDate: new Date(2018, 6, 16, 15, 15),
//     endDate: new Date(2018, 6, 16, 16, 30),
//     status: 2,
//     location: "Room 3",
//   },
//   {
//     title: "Customer Workshop",
//     startDate: new Date(2018, 6, 18, 11, 0),
//     endDate: new Date(2018, 6, 18, 12, 0),
//     status: 3,
//     location: "Room 1",
//   },
//   {
//     title: "Prepare 2015 Marketing Plan",
//     startDate: new Date(2018, 6, 20, 11, 0),
//     endDate: new Date(2018, 6, 20, 13, 30),
//     status: 1,
//     location: "Room 3",
//   },
//   {
//     title: "New Brochures",
//     startDate: new Date(2018, 6, 23, 14, 30),
//     endDate: new Date(2018, 6, 23, 15, 45),
//     status: 2,
//     location: "Room 3",
//   },
//   {
//     title: "Install New Database",
//     startDate: new Date(2018, 6, 23, 9, 45),
//     endDate: new Date(2018, 6, 23, 11, 15),
//     status: 3,
//     location: "Room 2",
//   },
//   {
//     title: "Approve New Online Marketing Strategy",
//     startDate: new Date(2018, 6, 26, 12, 0),
//     endDate: new Date(2018, 6, 26, 14, 0),
//     status: 4,
//     location: "Room 1",
//   },
//   {
//     title: "Upgrade Personal Computers",
//     startDate: new Date(2018, 6, 31, 15, 15),
//     endDate: new Date(2018, 6, 31, 16, 30),
//     status: 1,
//     location: "Room 3",
//   },
//   {
//     title: "Install New Database",
//     startDate: new Date(2018, 6, 31, 9, 45),
//     endDate: new Date(2018, 6, 31, 11, 15),
//     status: 2,
//     location: "Room 2",
//   },
// ];

// const resources = [
//   {
//     fieldName: "location",
//     title: "Location",
//     instances: [
//       { id: "Room 1", text: "Room 1", color: red },
//       { id: "Room 2", text: "Room 2", color: blue },
//       { id: "Room 3", text: "Room 3", color: red },
//     ],
//   },
//   {
//     fieldName: "status",
//     title: "Status",
//     instances: [
//       { id: 1, text: "INITIATED status", color: "#999999" },
//       { id: 2, text: "RUNNING status", color: blue },
//       { id: 3, text: "FAILED status", color: red },
//       { id: 4, text: "SUCCESS status", color: indigo },
//     ],
//   },
// ];

// const isWeekEnd = (date) => date.getDay() === 0 || date.getDay() === 6;
// const defaultCurrentDate = new Date(2018, 6, 2, 11, 15);

// const DayScaleCell = ({ startDate, ...restProps }) => (
//   <StyledMonthViewDayScaleCell
//     className={classNames({
//       [classes.weekEndDayScaleCell]: isWeekEnd(startDate),
//     })}
//     startDate={startDate}
//     {...restProps}
//   />
// );

// const TimeTableCell = ({ startDate, ...restProps }) => (
//   <StyledMonthViewTimeTableCell
//     className={classNames({
//       [classes.weekEndCell]: isWeekEnd(startDate),
//     })}
//     startDate={startDate}
//     {...restProps}
//   />
// );

// const Appointment = ({ data, ...restProps }) => (
//   <StyledAppointmentsAppointment
//     {...restProps}
//     className={classNames({
//       [classes.initiatedStatusAppointment]: data.status === 1,
//       [classes.runningStatusAppointment]: data.status === 2,
//       [classes.failedStatusAppointment]: data.status === 3,
//       [classes.successStatusAppointment]: data.status === 4,
//       [classes.appointment]: true,
//     })}
//     data={data}
//   />
// );

// // #FOLD_BLOCK
// const AppointmentContent = ({
//   data,
//   ...restProps
//   // #FOLD_BLOCK
// }) => {
//   let status = "INITIATED";
//   if (data.status === 2) status = "RUNNING";
//   if (data.status === 3) status = "FAILED";
//   if (data.status === 4) status = "SUCCESS";
//   return (
//     <StyledAppointmentsAppointmentContent {...restProps} data={data}>
//       <div className={classes.container}>
//         <div className={classes.text}>{data.title}</div>
//         <div className={classNames(classes.text, classes.content)}>
//           {`Status: ${status}`}
//         </div>
//         <div className={classNames(classes.text, classes.content)}>
//           {`Location: ${data.location}`}
//         </div>
//       </div>
//     </StyledAppointmentsAppointmentContent>
//   );
// };

// export const JobManager = () => (
//   <Paper sx={{ nothing: "still no error" }}>
//     <Scheduler data={appointments}>
//       <ViewState defaultCurrentDate={defaultCurrentDate} />

//       <MonthView
//         dayScaleCellComponent={DayScaleCell}
//         timeTableCellComponent={TimeTableCell}
//       />
//       <DayView
//         displayName={"Three days"}
//         startDayHour={9}
//         endDayHour={17}
//         intervalCount={6}
//       />

//       <Appointments
//         appointmentComponent={Appointment}
//         appointmentContentComponent={AppointmentContent}
//       />
//       <Resources data={resources} />

//       <AppointmentTooltip showCloseButton showOpenButton showDeleteButton />
//       <Toolbar />
//       <DateNavigator />
//       <ViewSwitcher />
//       <TodayButton />
//     </Scheduler>
//   </Paper>
// );

// first edit

// import * as React from "react";
// import Paper from "@mui/material/Paper/Paper";
// import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   Appointments,
//   AppointmentForm,
//   AppointmentTooltip,
//   WeekView,
//   EditRecurrenceMenu,
//   AllDayPanel,
//   ConfirmationDialog,
// } from "@devexpress/dx-react-scheduler-material-ui";

// const appointments = [
//   {
//     title: "Website Re-Design Plan",
//     startDate: new Date(2018, 5, 25, 9, 35),
//     endDate: new Date(2018, 5, 25, 11, 30),
//     id: 0,
//     status: "RUNNING",
//     location: "Room 1",
//   },
//   {
//     title: "Book Flights to San Fran for Sales Trip",
//     startDate: new Date(2018, 5, 25, 12, 11),
//     endDate: new Date(2018, 5, 25, 13, 0),
//     id: 1,
//     status: "RUNNING",
//     location: "Room 1",
//   },
//   {
//     title: "Install New Router in Dev Room",
//     startDate: new Date(2018, 5, 25, 14, 30),
//     endDate: new Date(2018, 5, 25, 15, 35),
//     id: 2,
//     status: "INITIATED",
//     location: "Room 2",
//   },
//   {
//     title: "Approve Personal Computer Upgrade Plan",
//     startDate: new Date(2018, 5, 26, 10, 0),
//     endDate: new Date(2018, 5, 26, 11, 0),
//     id: 3,
//     status: "FAILED",
//     location: "Room 2",
//   },
//   {
//     title: "Final Budget Review",
//     startDate: new Date(2018, 5, 26, 12, 0),
//     endDate: new Date(2018, 5, 26, 13, 35),
//     id: 4,
//     status: "SUCCESS",
//     location: "Room 2",
//   },
//   {
//     title: "New Brochures",
//     startDate: new Date(2018, 5, 26, 14, 30),
//     endDate: new Date(2018, 5, 26, 15, 45),
//     status: "SUCCESS",
//     id: 5,
//     location: "Room 2",
//   },
//   {
//     title: "Install New Database",
//     startDate: new Date(2018, 5, 27, 9, 45),
//     endDate: new Date(2018, 5, 27, 11, 15),
//     status: "FAILED",
//     id: 6,
//     location: "Room 1",
//   },
//   {
//     title: "Approve New Online Marketing Strategy",
//     startDate: new Date(2018, 5, 27, 12, 0),
//     endDate: new Date(2018, 5, 27, 14, 0),
//     status: "SUCCESS",
//     id: 7,
//     location: "Room 3",
//   },
//   {
//     title: "Upgrade Personal Computers",
//     startDate: new Date(2018, 5, 27, 15, 15),
//     endDate: new Date(2018, 5, 27, 16, 30),
//     id: 8,
//     status: "SUCCESS",
//     location: "Room 3",
//   },
// ];

// export const JobManager = () => {
//   const [data, setData] = React.useState(appointments);
//   const [currentDate, setCurrentDate] = React.useState(new Date("2018-06-27"));
//   const [addedAppointment, setAddedAppointment] = React.useState({});
//   const [editingAppointment, setEditedAppointment] = React.useState(undefined);
//   const [appointmentChanges, setAppointmentChanges] = React.useState({});

//   const changeAddedAppointment = (addedAppointment) => {
//     setAddedAppointment(addedAppointment);
//     setCurrentDate(currentDate);
//   };

//   const changeAppointmentChanges = (appointmentChanges) => {
//     setAppointmentChanges(appointmentChanges);
//   };

//   const changeEditingAppointment = (editingAppointment) => {
//     setEditedAppointment(editingAppointment);
//   };

//   const commitChanges = ({ added, changed, deleted }) => {
//     setData((prevData) => {
//       let dataToChange = prevData;
//       if (added) {
//         const startingAddedId =
//           dataToChange.length > 0
//             ? dataToChange[dataToChange.length - 1].id + 1
//             : 0;
//         dataToChange = [...dataToChange, { id: startingAddedId, ...added }];
//       }
//       if (changed) {
//         dataToChange = dataToChange.map((appointment) =>
//           changed[appointment.id]
//             ? { ...appointment, ...changed[appointment.id] }
//             : appointment
//         );
//       }
//       if (deleted !== undefined) {
//         dataToChange = dataToChange.filter(
//           (appointment) => appointment.id !== deleted
//         );
//       }
//       return dataToChange;
//     });
//   };

//   return (
//     <Paper>
//       <Scheduler data={data} height={560}>
//         <ViewState currentDate={currentDate} />
//         <EditingState
//           onCommitChanges={commitChanges}
//           addedAppointment={addedAppointment}
//           onAddedAppointmentChange={changeAddedAppointment}
//           appointmentChanges={appointmentChanges}
//           onAppointmentChangesChange={changeAppointmentChanges}
//           editingAppointment={editingAppointment}
//           onEditingAppointmentChange={changeEditingAppointment}
//         />
//         <WeekView startDayHour={9} endDayHour={17} />
//         <AllDayPanel />
//         <EditRecurrenceMenu />
//         <ConfirmationDialog />
//         <Appointments />
//         <AppointmentTooltip showOpenButton showDeleteButton />
//         <AppointmentForm />
//       </Scheduler>
//     </Paper>
//   );
// };

// Original

import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const JobManager = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imageModal, setImageModal] = useState("");
  const [job, setJob] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [isFiltering, setIsFiltering] = useState({
    SUBMITTED: false,
    Running: false,
    Failed: false,
    Completed: false,
  });

  const dataTypes = ["Generated Data", "Json Data", "Data URL"];
  const [dataTypeSelected, setSelectedDataType] = useState(dataTypes[0]);
  const createJob = async (data) => {
    const response = await API.createJob(data);
    if (response.success) {
      formik.values.downloadableURL = "";
      formik.values.jsonData = "";
      setSelectedService("");
      setSelectedDataType(dataTypes[0]);
      setModalIsOpen(false);
      getJob();
      notify("Job Creation successed!!");
    } else {
      setModalIsOpen(false);
      notify("Job Creation Failed!!");
    }
  };

  const getJob = useCallback(async () => {
    const response = await API.getJob();
    if (response.success) {
      setJob(response.data.data);
    } else {
      setJob([]);
      notify("Failed to Fetch Job List");
    }
  }, []);

  const viewData = (data) => {
    if (!data.insightsURL) return;
    const regex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
    const isImage = regex.test(data.insightsURL);
    if (isImage) {
      setImageModal(data.insightsURL);
      setImageModalIsOpen(true);
    } else if (data.dataURL) window.location.href = data.insightsURL;
  };

  useEffect(() => {
    getJob();
  }, [getJob]);

  const getService = useCallback(async () => {
    const response = await API.getService();
    if (response.success) {
      setServices(response.data.data);
    } else {
      setServices([]);
      notify("Failed to Fetch Service List");
    }
  }, []);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };
  const handleDataTypeChange = (event) => {
    setSelectedDataType(event.target.value);
  };

  useEffect(() => {
    getService();
  }, [getService]);
  console.log(JSON.stringify(job, null, 2));

  const resetTableData = (data) => {
    setDataForTable(
      data.map((item) => ({
        Status: item.jobStatus,
        JobName: "Job Name (Hard Coded)",
        Workers: "5 workers (Hard coded)",
        OperationTime: new Date(parseInt(item.createdAt)).toLocaleDateString(
          "en-AU",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }
        ),
        insightsURL: item.insightsURL,
      }))
    );
  };

  useEffect(() => {
    resetTableData(job);
  }, [job]);

  let formik = useFormik({
    initialValues: {
      downloadableURL: "",
      jsonData: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        downloadableURL: Yup.string().max(255),
        jsonData: Yup.string(),
      });
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        endpoint: selectedService.url,
        serviceID: selectedService._id,
        datafileURL: {
          url: values.downloadableURL,
          json: values.jsonData,
        },
      };
      createJob(data);
      resetForm();
    },
  });

  let createJobModal = (
    <Box>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <InputLabel sx={{ py: 1 }}>Select service</InputLabel>
          <Select
            placeholder="Select service"
            fullWidth
            value={selectedService}
            label="Service"
            onChange={handleServiceChange}
          >
            {services.map((service, i) => {
              return (
                <MenuItem value={service} key={i}>
                  {service.name}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel sx={{ py: 1 }}>Data Type</InputLabel>
          <Select
            placeholder="Select Datatype"
            fullWidth
            value={dataTypeSelected}
            label="Datatype"
            onChange={handleDataTypeChange}
          >
            {dataTypes.map((type, i) => {
              return (
                <MenuItem value={type} key={i}>
                  {type}
                </MenuItem>
              );
            })}
          </Select>
          {dataTypeSelected === dataTypes[1] ? (
            <TextField
              fullWidth
              label="Json Data"
              margin="normal"
              name="jsonData"
              type="text"
              value={formik.values.jsonData}
              variant="outlined"
              multiline
              rows={4}
              error={formik.touched.jsonData}
              helperText={formik.touched.jsonData && formik.errors.jsonData}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          ) : dataTypeSelected === dataTypes[2] ? (
            <TextField
              fullWidth
              label="Data URL Link"
              margin="normal"
              name="downloadableURL"
              type="text"
              value={formik.values.downloadableURL}
              variant="outlined"
              error={
                formik.touched.downloadableURL &&
                Boolean(formik.errors.downloadableURL)
              }
              helperText={
                formik.touched.downloadableURL && formik.errors.downloadableURL
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          ) : null}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              size="large"
              variant="contained"
              type="submit"
              onClick={() => setModalIsOpen(false)}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

  const imageModelContentToShow = (img) => (
    <Box
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      <img width="50%" src={img} alt="img" />
    </Box>
  );

  const filterStatus = (status, isFiltered) => {
    setDataForTable((prevState) =>
      prevState.filter((item) => item.Status === status)
    );
    if (isFiltered) {
      setIsFiltering((prevState) => ({ ...prevState, [status]: false }));
      resetTableData(job);
    } else {
      setIsFiltering((prevState) => ({ ...prevState, [status]: true }));
    }
  };

  let content = (
    <Box>
      <EnhancedModal
        isOpen={imageModalIsOpen}
        dialogTitle={`Image`}
        dialogContent={imageModelContentToShow(imageModal)}
        options={{
          onClose: () => setImageModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Create Job service`}
        dialogContent={createJobModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <Box maxWidth="xl" sx={{ textAlign: "right", ml: 4 }}>
        <Button
          size="middle"
          variant="contained"
          sx={{
            backgroundColor: "#7f7f7f",
            "&:hover": { backgroundColor: "#6a6a6a" },
          }}
          onClick={() => {
            filterStatus("SUBMITTED", isFiltering.SUBMITTED);
          }}
        >
          Initiated
        </Button>
        <Button
          size="middle"
          variant="contained"
          onClick={() => {
            filterStatus("Running", isFiltering.Running);
          }}
        >
          Running
        </Button>
        <Button
          size="middle"
          variant="contained"
          color="error"
          onClick={() => {
            filterStatus("Failed", isFiltering.Failed);
          }}
        >
          Failed
        </Button>
        <Button
          size="middle"
          variant="contained"
          sx={{
            backgroundColor: "green",
            "&:hover": { backgroundColor: "#185a37" },
          }}
          onClick={() => {
            filterStatus("Completed", isFiltering.Completed);
            // setIsFiltering((prevState) => ({
            //   ...prevState,
            //   success: !isFiltering.success,
            // }));
          }}
        >
          Success
        </Button>
        <Button
          size="middle"
          variant="contained"
          onClick={() => setModalIsOpen(true)}
        >
          Create Job
        </Button>
      </Box>
      <Box maxWidth="xl" sx={{ mt: 2, ml: 4 }}>
        {dataForTable.length > 0 ? (
          <EnhancedTable
            data={dataForTable}
            title=" "
            options={{
              selector: true,
              ignoreKeys: [
                "deakinSSO",
                "firstLogin",
                "emailVerified",
                "isBlocked",
                "__v",
                "createdAt",
                "insightsURL",
                "serviceID",
              ],
              actions: [
                {
                  name: "",
                  label: "View",
                  type: "button",
                  function: async (e, data) => {
                    if (!data) return;
                    console.log(JSON.stringify(data, null, 2));
                    viewData(job[dataForTable.indexOf(data)]);
                    viewData(data);
                  },
                },
                {
                  name: "",
                  label: "remove",
                  type: "button",
                  function: async (e, data) => {
                    if (!data) return;
                    dataForTable.splice(dataForTable.indexOf(data), 1);
                    setDataForTable((prevState) => [...prevState]);
                  },
                },
              ],
            }}
          />
        ) : (
          <Paper sx={{ py: 4 }}>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              No Data
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );

  return content;
};
