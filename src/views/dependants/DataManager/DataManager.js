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
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
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

  const [jobDataUrl, setJobDataUrl] = useState();
  const [jobName, setJobName] = useState("");
  // delete comfirmation
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [dataForTable, setDataForTable] = useState([]);

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
    if (response.success) {
      setS3url(response.data.documentFileUrl.original);
    }
    uploadDataset(formData);
  }, [isFilePicked, selectedFile]);

  useEffect(() => {
    handleFileUploadSubmission();
  }, [handleFileUploadSubmission]);

  const deleteDataEntry = async (data) => {
    const response = await API.deleteDataEntry(data.id);
    if (response.success) {
      console.log("_");
    } else {
      notify("delete Object  Failed");
    }
  };

  const createDataEntry = async (data) => {
    const response = await API.createDataEntry(data);
    if (response.success) {
      setS3url("");
      setDataModalOpen(false);
      getDatasets();
    } else {
      notify("data entry Creation Failed!!");
    }
  };

  const initialValues = {
    description: "",
    name: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      description: Yup.string().max(255).required("description Is Required"),
      name: Yup.string().min(5).max(255).required("Name Is Required"),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      dataURL: s3url,
      description: values.description,
      name: values.name,
    };
    createDataEntry(data);
    resetForm();
  };
  let deleteConfirmModal = (
    <Box>
      <Typography>Do you want to delete this Dataset?</Typography>
    </Box>
  );
  let uploadFilesContent = (
    <Box sx={{ mb: 2 }}>
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
      <Typography>File to Upload: {s3url}</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              label="Data Entry Name"
              margin="normal"
              name="name"
              type="text"
              variant="outlined"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <Field
              as={TextField}
              fullWidth
              label="Description"
              margin="normal"
              name="description"
              type="text"
              variant="outlined"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                color="primary"
                disabled={isSubmitting}
                size="large"
                variant="contained"
                type="submit"
              >
                Create Data Entry
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
  const filterDataSets = (data) => {
    setDatasets(
      data.map((item) => ({
        _id: item._id,
        Name: item.name,
        URL: item.dataURL,
        Description: item.description,
        "Creator ID": item.creatorID,
      }))
    );
  };
  const resetTableData = (data) => {
    setDataForTable(
      data.map((item) => ({
        name: item.name,
        id: item._id,
        requirments: item.requirements,
        url: item.url,
        description: item.description,
        cost: item.cost,
        creator_id: item.creator_id ?? "null",
      }))
    );
  };
  useEffect(() => {
    resetTableData(datasets);
  }, [datasets]);
  
  const getDatasets = useCallback(async () => {
    const response = await API.getDatasets();
    if (response.success) {
      if (isMounted) filterDataSets(response.data.data);
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
  const createJob = (data) => {
    setServiceModalOpen(true);
    setJobDataUrl(data.dataURL);
  };

  const postCreateJobData = async () => {
    const _jobDataToSend = {
      datafileURL: {
        url: jobDataUrl,
        json: "",
      },
      jobName: jobName,
      endpoint: selectedService.url,
      serviceID: selectedService._id,
    };
    const response = await API.createJob(_jobDataToSend);
    if (response.success) {
      notify("Job Creation succeeded!!");
      setServiceModalOpen(false);
    } else {
      notify("Job Creation Failed!!");
      setServiceModalOpen(false);
    }
  };

  let serviceModal = (
    <Container sx={{ p: 1 }}>
      <FormControl fullWidth>
        <TextField
          sx={{ py: 1 }}
          fullWidth
          name="jobName"
          label="Job Name"
          value={jobName}
          onChange={(event) => {
            setJobName(event.target.value);
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Select Service</InputLabel>
        <Select
          value={selectedService}
          label="Select Service"
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
        <Button sx={{ mt: 2 }} variant="contained" onClick={postCreateJobData}>
          Submit
        </Button>
      </FormControl>
    </Container>
  );

  let content = (
    <Box>
      <EnhancedModal
        isOpen={dataModalOpen}
        dialogTitle={`Upload New Data Entry`}
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
      <EnhancedModal
        isOpen={deleteModal}
        dialogTitle={`Comfirm Deletion`}
        dialogContent={deleteConfirmModal}
        options={{
          submitButtonName: "Delete",
          onClose: () => setDeleteModal(false),
          onSubmit: () => {
            deleteDataEntry(selectedData), setDeleteModal(false),dataForTable.splice(dataForTable.indexOf(selectedData), 1);
          },
        }}
      />
      <Box maxWidth="xl" sx={{ ml: 4 }}>
        <Box sx={{ textAlign: "right" }}>
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            onClick={() => setDataModalOpen(true)}
          >
            Upload Data
          </Button>
        </Box>
        {datasets.length > 0 ? (
          <EnhancedTable
            data={dataForTable}
            title="Datasets Manager"
            options={{
              selector: true,
              ignoreKeys: ["_id", "__v"],
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
                    window.location.href = data["URL"];
                  },
                },
                {
                  name: "",
                  label: "remove",
                  type: "button",
                  function: async (e, data) => {
                    if (!data) return;
                    setSelectedData(data);
                    setDeleteModal(true);
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
