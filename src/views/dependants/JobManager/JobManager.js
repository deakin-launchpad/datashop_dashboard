import { Box, Container, Button, TextField } from "@mui/material";
import { LayoutConfig } from "constants/index";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const JobManager = () => {
  // const [job, setJob] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [job, setJob] = useState([]);

  const createJob = async (data) => {
    let requirements = data.requirements.split(",");
    data.requirements = requirements;
    console.log(data, "dt");

    try {
      const response = await API.createService(data);
      if (response.success) {
        formik.values.url = "";
        formik.values.name = "";
        setModalIsOpen(false);
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
  }, []);

  let formik = useFormik({
    initialValues: {
      url: "",
      name: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        url: Yup.string().max(255).required("url Is Required"),
        name: Yup.string().min(5).max(255).required("Password Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        url: values.url,
        name: values.name,
      };
      console.log(data);
      createJob(data);
    },
  });

  let createJobModal = (
    <Box>
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Service Name"
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
            label="URL Link"
            margin="normal"
            name="url"
            type="text"
            value={formik.values.lastName}
            variant="outlined"
            error={formik.touched.url && Boolean(formik.errors.url)}
            helperText={formik.touched.url && formik.errors.url}
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
              onClick={() => setModalIsOpen(false)}
            >
              Create Service
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

  let content = (
    <Box sx={LayoutConfig.defaultContainerSX}>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`create Job service`}
        dialogContent={createJobModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <Container>
        <br />
        <br />
        <Button
          size="middle"
          variant="contained"
          onClick={() => setModalIsOpen(true)}
        >
          Create Job
        </Button>
        <br />
        <br />
      </Container>
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: "100px",
            sm: window.screen.availHeight / 50,
          },
        }}
      >
        <EnhancedTable
          data={job}
          title="Job Manager"
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

  return <Box sx={LayoutConfig.defaultContainerSX}>{content}</Box>;
};
