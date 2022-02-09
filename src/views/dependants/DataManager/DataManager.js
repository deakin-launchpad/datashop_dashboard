import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify, EnhancedModal } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import {
  Box,
  Container,
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const DatasetsManager = () => {
  const [datasets, setDatasets] = useState([]);
  const isMounted = useIsMountedRef();
  const [dataModalOpen, setDataModalOpen] = useState(false);

  //selectedFile,isFilePicked and s3url are used when uploading file
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [s3url, setS3url] = useState("");

  //dataset and service used when creating job
  const [totalService, setTotalService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  // display url by button and modal
  const [thisDataLnkModalOpen, setThisDataLnkModalOpen] = useState(false);
  const [thisDataLink, setThisDataLink] = useState("");

  //create data entry function
  const createDataEntry = async (data) => {
    try {
      const response = await API.createDataEntry(data);
      if (response.success) {
        // formik.values.dataURL = s3url;
        formik.values.description = "";
        formik.values.name = "";
        setDataModalOpen(false);
        getDatasets();
      } else {
        notify("data entry Creation Failed!!");
      }
    } catch (err) {
      setDataModalOpen(false);
    }
  };

  // formik used in update datasets entry function
  let formik = useFormik({
    initialValues: {
      // dataURL: s3url,
      description: "",
      name: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        // dataURL: Yup.string().max(255).required("url Is Required"),
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

  // model used in update datasets entry function
  let createDataEntryModal = (
    <Box>
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
          {/* <TextField
            fullWidth
            label="URL Link"
            margin="normal"
            name="dataURL"
            type="text"
            value={formik.values.dataURL}
            variant="outlined"
            error={formik.touched.dataURL && Boolean(formik.errors.dataURL)}
            helperText={formik.touched.dataURL && formik.errors.dataURL}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          /> */}
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
  // get datasets function
  const getDatasets = useCallback(async () => {
    try {
      const response = await API.getDatasets();
      if (response.success) {
        if (isMounted) setDatasets(response.data.data);
      } else {
        setDatasets([]);
        notify("Failed to Fetch Data List");
      }
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);
  useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  //
  //upload dataset function
  //
  const uploadDataset = async (data) => {
    try {
      const response = await API.uploadDocument(data);
      if (response.success) {
        (response) => response.json();
      } else {
        notify("Data Uploading Failed!!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      handleSubmission();
    }
  };
  // handleSubmission upload dataset function
  const handleSubmission = useCallback(async () => {
    // HANDLING FILE AS SENDING FILE INTO BACKEND
    if (!isFilePicked) return;
    const formData = new FormData();
    console.log(selectedFile, "file");
    formData.append("documentFile", selectedFile);
    console.log("11from11", formData);
    await fetch("http://localhost:8000/api/upload/uploadDocument", {
      method: "POST",
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setS3url(data.data.documentFileUrl.original);
      });

    uploadDataset(formData);
  }, [isFilePicked, selectedFile]);

  useEffect(() => {
    handleSubmission();
  }, [selectedFile]);
  //upload dataset form
  let secondContent = (
    <div>
      <input type="file" name="documentFile" onChange={changeHandler} />
      <div>{/* <button onClick={handleSubmission}>Submit</button> */}</div>
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
        </div>
      ) : (
        <div>
          <p>Select a file</p>
        </div>
      )}
    </div>
  );

  //get service function

  const getService = useCallback(async () => {
    try {
      const response = await API.getService();
      if (response.success) {
        setTotalService(response.data.data);
        console.log("service list:", response.data.data);
      } else {
        setTotalService([]);
        notify("Failed to Fetch Service List");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getService();
  }, [getService]);

  //create job function
  const createJob = async (data) => {
    try {
      const response = await API.createJob(data);
      if (response.success) {
        // formik.values.downloadableURL = "";
        // formik.values.serviceName = "";
        notify("Job Creation successed!!");
      } else {
        notify("Job Creation Failed!!");
      }
    } catch (err) {
      console.log(err);
      // setModalIsOpen(false);
    }
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };
  let serviceModal = (
    <Container>
      {" "}
      <FormControl fullWidth>
        <InputLabel>service</InputLabel>
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
      </FormControl>
    </Container>
  );
  let dataLinkModal = <Typography>{thisDataLink}</Typography>;

  let content = (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <EnhancedModal
        isOpen={dataModalOpen}
        dialogTitle={`upload new data entry`}
        dialogContent={createDataEntryModal}
        options={{
          onClose: () => setDataModalOpen(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <EnhancedModal
        isOpen={thisDataLnkModalOpen}
        dialogTitle={`S3 Link:`}
        dialogContent={dataLinkModal}
        options={{
          onClose: () => setThisDataLnkModalOpen(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <EnhancedModal
        isOpen={serviceModalOpen}
        dialogTitle={`choose service`}
        dialogContent={serviceModal}
        options={{
          onClose: () => setServiceModalOpen(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <Container
        maxWidth="lg"
      >
        {" "}
        {secondContent}
        <Button
          // size="middle"
          variant="contained"
          onClick={() => setDataModalOpen(true)}
        >
          Upload Data
        </Button>
        <Container>
          <Grid
            Container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {datasets.length > 0 ? (
              datasets.map((data) => {
                return (
                  <Box key={data._id} mb={4}>
                    <Card width={50}>
                      <CardContent>
                        <div style={{ width: 300, whiteSpace: "nowrap" }}>
                          <Typography
                            component="div"
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                            gutterBottom
                          >
                            {data.name}
                            {/* {data._id} */}
                          </Typography>
                          <Typography
                            component="div"
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                            gutterBottom
                          >
                            {data.dataURL}
                          </Typography>
                          <Link href={data.dataURL}>Data Link</Link>
                          <Button
                            onClick={() => {
                              setThisDataLink(data.dataURL);
                              setThisDataLnkModalOpen(true);
                            }}
                          >
                            Link
                          </Button>
                          <Typography
                            component="div"
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                            gutterBottom
                          >
                            {data.description}
                          </Typography>
                        </div>
                      </CardContent>
                      <CardActions>
                        {/* choose service */}
                        <Button
                          size="small"
                          onClick={() => {
                            setServiceModalOpen(true);
                          }}
                        >
                          Choose Service
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            const jobData = {
                              downloadableURL: data.dataURL,
                              endpoint: selectedService.url,
                            };
                            console.log("jobdata", jobData);
                            createJob(jobData);
                          }}
                        >
                          Create Job
                        </Button>
                      </CardActions>
                    </Card>{" "}
                  </Box>
                );
              })
            ) : (
              <Typography>No Data Available</Typography>
            )}
          </Grid>
        </Container>
        {/* Datasets Manager EnhancedTable */}
        <EnhancedTable
          data={datasets}
          title="Datasets Manager"
          options={{
            ignoreKeys: [
              "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
            ],
          }}
        />
      </Container>
    </Box>
  );
  return content;
};
