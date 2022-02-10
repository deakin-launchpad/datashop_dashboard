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

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [s3url, setS3url] = useState("");

  const [totalService, setTotalService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const [thisDataLnkModalOpen, setThisDataLnkModalOpen] = useState(false);
  const [thisDataLink, setThisDataLink] = useState("");

  const [jobDataUrl,setJobDataUrl] = useState();

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

  const createDataEntry = async (data) => {
    try {
      const response = await API.createDataEntry(data);
      if (response.success) {
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
    <div>
      <input type="file" name="documentFile" onChange={changeHandler} />
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
    try {
      const response = await API.createJob(_jobDataTosend);
      if (response.success) {
        notify("Job Creation successed!!");
        setServiceModalOpen(false);
      } else {
        notify("Job Creation Failed!!");
        setServiceModalOpen(false);
      }
    } catch (err) {
      setServiceModalOpen(false);
      console.log(err);
    }
  };

  let serviceModal = (
    <Container sx={{p:1}}>
      <FormControl fullWidth >
        <InputLabel sx={{py:1}}>Select service</InputLabel>
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
  let dataLinkModal = <Typography>{thisDataLink}</Typography>;

  let content = (
    <Box>
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
        dialogTitle={`Create Job`}
        dialogContent={serviceModal}
        options={{
          onClose: () => setServiceModalOpen(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <Container
        maxWidth="xl"
      ><Button
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
                        <Button
                          size="small"
                          onClick={() => {
                            createJob(data);
                          }}
                        >
                          Create Job
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                );
              })
            ) : (
              <Typography>No Data Available</Typography>
            )}
          </Grid>
        </Container>
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
