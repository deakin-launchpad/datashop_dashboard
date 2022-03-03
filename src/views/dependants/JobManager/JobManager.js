import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
  FormControl,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSocket } from "helpers/index";
import { format } from "date-fns";

const statuses = ["ALL", "INITIATED", "RUNNING", "FAILED", "SUCCESS"];

export const JobManager = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imageModal, setImageModal] = useState("");
  const [job, setJob] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [statusToFilter, setStatusToFilter] = useState(statuses[0]);

  const dataTypes = ["Generated Data", "Json Data", "Data URL"];
  const [dataTypeSelected, setSelectedDataType] = useState(dataTypes[0]);
  const createJob = async (data) => {
    const response = await API.createJob(data);
    if (response.success) {
      setSelectedService("");
      setSelectedDataType(dataTypes[0]);
      setModalIsOpen(false);
      getJob();
      notify("Job Creation succeeded!!");
    } else {
      setModalIsOpen(false);
      notify("Job Creation Failed!!");
    }
  };
  const deleteJob = async (data) => {
    try {
      console.log("job detail----->", data);
      const response = await API.deleteJob(data.id);
      if (response.success) {
        getJob();
      } else {
        notify("delete Job Failed");
      }
    } catch (err) {
      // creatObjectModal(false);
      console.log(err);
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

  useSocket("on", "notification", (response) => {
    console.log(response);
  });

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
        id: item._id,
        Status: item.jobStatus,
        "Job Name": item.jobName,
        "Execution Time": item.executionTime,
        "Operation Time": format(
          new Date(parseInt(item.createdAt)),
          "yyyy-MM-dd HH:mm:ss"
        ),
        insightsURL: item.insightsURL,
      }))
    );
  };

  useEffect(() => {
    resetTableData(job);
  }, [job]);

  const jsonDataValidate = (data) => {
    if (!data.includes("gender")) return notify("No gender available.");
    if (!data.includes("TotalHeight"))
      return notify("No TotalHeight available");
    if (!data.includes("Inseam")) return notify("No Inseam available");
    if (!data.includes("Bust")) return notify("No Bust available.");
    if (!data.includes("UnderBust")) return notify("No UnderBust available");
    if (!data.includes("Waist")) return notify("No Waist available");
    if (!data.includes("HighHip")) return notify("No HighHip available.");
    if (!data.includes("LowHip")) return notify("No LowHip available");
    if (!data.includes("HighThigh")) return notify("No HighThigh available");
    if (!data.includes("LowThigh")) return notify("No LowThigh available.");
    if (!data.includes("NeckBase")) return notify("No NeckBase available");
    if (!data.includes("Suitleglength"))
      return notify("No Suitleglength available");
    return true;
  };

  const initialValues = {
    downloadableURL: "",
    jsonData: `{
        "gender": "female",
        "TotalHeight": 1715,
        "Inseam": 845,
        "Bust": 880,
        "UnderBust": 780,
        "Waist": 721,
        "HighHip": 770,
        "LowHip": 865,
        "HighThigh": 491,
        "LowThigh": 417,
        "NeckBase": 460,
        "Suitleglength": 190,
      }`,
    jobName: "",
    service: "",
    dataType: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      downloadableURL: Yup.string().max(255),
      jobName: Yup.string().required("Job name is required"),
      jsonData: Yup.string(),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      jobName: values.jobName,
      endpoint: selectedService.url,
      serviceID: selectedService._id,
      datafileURL: {
        url: values.downloadableURL,
        json: dataTypeSelected === dataTypes[1] ? values.jsonData : "",
      },
    };
    if (dataTypeSelected === dataTypes[1]) {
      const valid = jsonDataValidate(values.jsonData);
      if (valid) {
        createJob(data);
      }
    } else {
      createJob(data);
    }
    resetForm();
  };

  let createJobModal = (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <InputLabel sx={{ py: 1 }}>Job Name</InputLabel>
            <Field
              as={TextField}
              name="jobName"
              type="text"
              autoComplete="off"
              fullWidth
              error={errors.jobName !== undefined}
              helperText={touched.jobName && errors.jobName}
            />
            <InputLabel sx={{ py: 1 }}>Select Service</InputLabel>
            <Field
              as={Select}
              name="service"
              placeholder="Select Service"
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
            </Field>

            <InputLabel sx={{ py: 1 }}>Data Type</InputLabel>
            <Field
              as={Select}
              name="dataType"
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
            </Field>
            {dataTypeSelected === dataTypes[1] ? (
              <Box>
                <Typography sx={{ mt: 2 }} variant="body2">
                  * Please keep the data structure and field name and change the
                  values.
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  label="Json Data"
                  margin="normal"
                  name="jsonData"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={10}
                  error={touched.jsonData}
                  helperText={touched.jsonData && errors.jsonData}
                />
              </Box>
            ) : dataTypeSelected === dataTypes[2] ? (
              <Field
                as={TextField}
                fullWidth
                label="Data URL Link"
                margin="normal"
                name="downloadableURL"
                type="text"
                variant="outlined"
                error={
                  touched.downloadableURL && Boolean(errors.downloadableURL)
                }
                helperText={touched.downloadableURL && errors.downloadableURL}
              />
            ) : null}
            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                size="large"
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Form>
        )}
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

  const filterStatus = (status) => {
    setStatusToFilter(status);
    if (status === "ALL") {
      resetTableData(job);
      setIsFiltered(false);
      return;
    }
    if (isFiltered) {
      resetTableData(job);
    }
    setIsFiltered(true);
    setDataForTable((prevState) =>
      prevState.filter((item) => item.Status === status)
    );
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
      <Box
        maxWidth="xl"
        sx={{
          textAlign: "right",
          ml: 4,
          pt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          gap: 2,
        }}
      >
        <FormControl sx={{ width: "8.5em" }}>
          <InputLabel>Filter Status:</InputLabel>
          <Select
            label="Filter status"
            value={statusToFilter}
            sx={{ textAlign: "center" }}
            onChange={(e) => {
              filterStatus(e.target.value);
            }}
          >
            {statuses.map((s, i) => (
              <MenuItem value={s} key={i}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              selectSortBy: "Operation Time",
              ignoreKeys: [
                "deakinSSO",
                "firstLogin",
                "emailVerified",
                "isBlocked",
                "__v",
                "createdAt",
                "insightsURL",
                "id",
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
                    console.log("data.id :", data.id);
                    deleteJob(data);
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
