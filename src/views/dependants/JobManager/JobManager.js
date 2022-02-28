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
    RUNNING: false,
    FAILED: false,
    SUCCESS: false,
  });

  const dataTypes = ["Generated Data", "Json Data", "Data URL"];
  const [dataTypeSelected, setSelectedDataType] = useState(dataTypes[0]);
  const createJob = async (data) => {
    const response = await API.createJob(data);
    if (response.success) {
      formik.values.downloadableURL = "";
      formik.values.jobName = "";
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
    } else if (data.dataURL && data.dataURL !== "") {
      window.location.href = data.dataURL;
    } else if (
      data.insightsURL &&
      /\.(doc|doc?x|json|pdf|zip)$/i.test(data.insightsURL)
    ) {
      window.location.href = data.insightsURL;
    }
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

  const resetTableData = (data) => {
    setDataForTable(
      data.map((item) => ({
        Status: item.jobStatus,
        JobName: item.jobName,
        ExecutionTime: item.executionTime,
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
      jobName: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        downloadableURL: Yup.string().max(255),
        jobName: Yup.string(),
        jsonData: Yup.string(),
      });
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        jobName: values.jobName,
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
          <InputLabel sx={{ py: 1 }}>Job Name</InputLabel>
          <TextField
            sx={{ py: 1 }}
            fullWidth
            name="jobName"
            value={formik.values.jobName}
            onChange={formik.handleChange}
          />
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
          SUBMITTED
        </Button>
        <Button
          size="middle"
          variant="contained"
          onClick={() => {
            filterStatus("RUNNING", isFiltering.RUNNING);
          }}
        >
          Running
        </Button>
        <Button
          size="middle"
          variant="contained"
          color="error"
          onClick={() => {
            filterStatus("FAILED", isFiltering.FAILED);
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
            filterStatus("SUCCESS", isFiltering.SUCCESS);
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
              enableSort: true,
              sortAscending: false,
              selectSortBy: "OperationTime",
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
