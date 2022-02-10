import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify, EnhancedModal } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import {
  Box,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const DatasetsManager = () => {
  const [datasets, setDatasets] = useState([]);
  const isMounted = useIsMountedRef();
  const [dataModalOpen, setDataModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [s3url, setS3url] = useState("");

  const [totalService, setTotalService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const [jobDataUrl,setJobDataUrl] = useState();

  const uploadDataset = async (data) => {
    const response = await API.uploadDocument(data);
    if (response.success) {
      (response) => response.json();
    } else {
      notify("Data Uploading Failed!!");
    }
  };
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      handleFileUploadSubmission();
    }
  };
  const handleFileUploadSubmission = useCallback(async () => {
    if (!isFilePicked) return;
    const formData = new FormData();
    formData.append("documentFile", selectedFile);
    const response = await API.uploadDocument(formData);
    if(response.success){
      setS3url(response.data.documentFileUrl.original);
    }
    uploadDataset(formData);
  }, [isFilePicked, selectedFile]);

  useEffect(() => {
    handleFileUploadSubmission();
  }, [handleFileUploadSubmission]);

  const createDataEntry = async (data) => {
    const response = await API.createDataEntry(data);
    if (response.success) {
      formik.values.description = "";
      formik.values.name = "";
      setS3url("");
      setDataModalOpen(false);
      getDatasets();
    } else {
      notify("data entry Creation Failed!!");
    }
  };

  let formik = useFormik({
    initialValues: {
      description: "",
      name: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        description: Yup.string().max(255).required("description Is Required"),
        name: Yup.string().min(5).max(255).required("Name Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        dataURL: s3url,
        description: values.description,
        name: values.name,
      };
      createDataEntry(data);
    },
  });

  let uploadFilesContent = (
    <Box sx={{mb:2}}>
      <input type="file" name="documentFile" onChange={changeHandler} />
      {isFilePicked ? (
        <Typography variant="root">
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
        </Typography>
      ) : null}
    </Box>
  );
  let createDataEntryModal = (
    <Box>
      {uploadFilesContent}
      <Typography>File to upload: {s3url}</Typography>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="data entry Name"
            margin="normal"
            name="name"
            type="text"
            value={formik.values.name}
            variant="outlined"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label=" description"
            margin="normal"
            name="description"
            type="text"
            value={formik.values.description}
            variant="outlined"
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              color="primary"
              disabled={formik.isSubmitting}
              size="large"
              variant="contained"
              type="submit"
            >
              Create data entry
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

  const getDatasets = useCallback(async () => {
    const response = await API.getDatasets();
    if (response.success) {
      if (isMounted) setDatasets(response.data.data);
    } else {
      setDatasets([]);
      notify("Failed to Fetch Data List");
    }
  }, [isMounted]);

  useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  const getService = useCallback(async () => {
    const response = await API.getService();
    if (response.success) {
      setTotalService(response.data.data);
    } else {
      setTotalService([]);
      notify("Failed to Fetch Service List");
    }
  }, []);

  useEffect(() => {
    getService();
  }, [getService]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };
  const createJob = (data)=>{
    setServiceModalOpen(true);
    setJobDataUrl(data.dataURL);
  };

  const postCreateJobData = async () => {
    const _jobDataTosend = {
      datafileURL: {
        url: jobDataUrl,
        json: ""
      },
      endpoint: selectedService.url,
      serviceID:selectedService._id,
    };
    const response = await API.createJob(_jobDataTosend);
    if (response.success) {
      notify("Job Creation successed!!");
      setServiceModalOpen(false);
    } else {
      notify("Job Creation Failed!!");
      setServiceModalOpen(false);
    }
  };

  let serviceModal = (
    <Container sx={{p:1}}>
      <FormControl fullWidth >
        <InputLabel sx={{pb:1}}>Select service</InputLabel>
        <Select
          value={selectedService}
          label="Service"
          onChange={handleServiceChange}
        >
          {totalService.map((service, i) => {
            return (
              <MenuItem value={service} key={i}>
                {service.name}
              </MenuItem>
            );
          })}
        </Select>
        <Button sx={{mt:2}} variant="contained" onClick={postCreateJobData}>Submit</Button>
      </FormControl>
    </Container>
  );

  let content = (
    <Box>
      <EnhancedModal
        isOpen={dataModalOpen}
        dialogTitle={`Upload new data entry`}
        dialogContent={createDataEntryModal}
        options={{
          onClose: () => setDataModalOpen(false),
          disableSubmit: true,
        }}
      />
      <EnhancedModal
        isOpen={serviceModalOpen}
        dialogTitle={`Create Job`}
        dialogContent={serviceModal}
        options={{
          onClose: () => setServiceModalOpen(false),
          disableSubmit: true,
        }}
      />
      <Box
        maxWidth="xl"
        sx={{ml:4}}
      >
        <Box sx={{textAlign:'right'}}>
          <Button
            sx={{mb:2}}
            variant="contained"
            onClick={() => setDataModalOpen(true)}
          >
          Upload Data
          </Button>
        </Box>
        {datasets.length > 0 ? <EnhancedTable
          data={datasets}
          title="Datasets Manager"
          options={{
            selector:true,
            ignoreKeys: [
              "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
            ],
            actions: [
              {
                name: "",
                label: "Create Job",
                type: "button",
                function: async (e, data) => {
                  createJob(data);
                },
              },
              {
                name: "",
                label: "Download",
                type: "button",
                function: async (e, data) => {
                  window.location.href = data.dataURL;
                },
              },
            ],
          }}
        /> :<Paper sx={{py:4}}><Typography variant="body1" sx={{textAlign:'center'}}>No Data</Typography></Paper> }
        
      </Box>
    </Box>
  );
  return content;
};
