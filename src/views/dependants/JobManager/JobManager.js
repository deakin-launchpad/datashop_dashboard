import { Box, Button, TextField ,Select,InputLabel, MenuItem} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const JobManager = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [job, setJob] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const dataTypes = [
    'Generated Data','Json Data','Data URL'
  ];
  const [dataTypeSelected, setSelectedDataType] = useState(dataTypes[0]);
  const createJob = async (data) => {
    try {
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
        notify("Job Creation Failed!!");
      }
    } catch (err) {
      setModalIsOpen(false);
    }
  };

  const getJob = useCallback(async () => {
    try {
      const response = await API.getJob();
      if (response.success) {
        setJob(response.data.data);
      } else {
        setJob([]);
        notify("Failed to Fetch Job List");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getJob();
  }, [getJob]);

  const getService = useCallback(async () => {
    try {
      const response = await API.getService();
      if (response.success) {
        setServices(response.data.data);
      } else {
        setServices([]);
        notify("Failed to Fetch Service List");
      }
    } catch (err) {
      console.log(err);
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
      const data ={
        endpoint: selectedService.url,
        serviceID:selectedService._id,
        datafileURL: {
          "url":  values.downloadableURL,
          "json": values.jsonData
        }
      };
      createJob(data);
      resetForm();

    },
  });

  let createJobModal = (
    <Box>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <InputLabel sx={{py:1}}>Select service</InputLabel>
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
         
          <InputLabel sx={{py:1}}>Data Type</InputLabel>
          <Select
            placeholder="Select Datatype"
            fullWidth
            value={dataTypeSelected}
            label="Datatype"
            onChange={handleDataTypeChange}
          >
            {dataTypes.map((type,i) => {
              return (
                <MenuItem value={type} key={i}>
                  {type}
                </MenuItem>
              );
            })}
          </Select>
          {dataTypeSelected === dataTypes[1] ? <TextField
            fullWidth
            label="Json Data"
            margin="normal"
            name="jsonData"
            type="text"
            value={formik.values.jsonData}
            variant="outlined"
            multiline
            rows={4}
            error={
              formik.touched.jsonData
            }
            helperText={
              formik.touched.jsonData && formik.errors.jsonData
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          /> : dataTypeSelected === dataTypes[2] ? <TextField
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
          />: null }
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

  let content = (
    <Box>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Create Job service`}
        dialogContent={createJobModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <Box maxWidth="xl" sx={{textAlign:'right',ml:4}}>
        <Button
          size="middle"
          variant="contained"
          onClick={() => setModalIsOpen(true)}
        >
          Create Job
        </Button>
      </Box>
      <Box
        maxWidth="xl"
        sx={{mt:2,ml:4}}
      >
        <EnhancedTable
          data={job}
          title="Job Manager"
          options={{
            selector:true,
            ignoreKeys: [
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
              "createdAt",
            ],
          }}
        />
      </Box>
    </Box>
  );

  return content;
};
