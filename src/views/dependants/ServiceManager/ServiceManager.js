import {
  Box,
  Container,
  Typography,
  CardContent,
  Card,
  Button,
  CardActions,
  TextField,
} from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { LayoutConfig } from "constants/index";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import {
  FormControl,
  Grid,
} from "../../../../node_modules/@mui/material/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const ServiceManager = () => {
  const [service, setService] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModal, setserviceModal] = useState(false);

  const getService = useCallback(async () => {
    try {
      const response = await API.getService();
      if (response.success) {
        setService(response.data.data);
      } else {
        setService([]);
        notify("Failed to Fetch Service List");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getService();
  }, []);

  const createService = async (data) => {
    let requirements = data.requirements.split(",");
    data.requirements = requirements;
    console.log(data, "dt");

    try {
      const response = await API.createService(data);
      if (response.success) {
        formik.values.url = "";
        formik.values.description = "";
        formik.values.name = "";
        formik.values.cost = "";
        formik.values.serviceId = "";
        formik.values.requirements = "";
        setserviceModal(false);
        getService();
      } else {
        notify("Service Creation Failed!!");
      }
    } catch (err) {
      setserviceModal(false);
    }
  };

  let formik = useFormik({
    initialValues: {
      url: "",
      description: "",
      name: "",
      cost: "",
      serviceId: "",
      requirements: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        url: Yup.string().max(255).required("url Is Required"),
        description: Yup.string().max(255).required("description Is Required"),
        name: Yup.string().min(5).max(255).required("Password Is Required"),
        serviceId: Yup.string().max(255).required("description Is Required"),
        cost: Yup.string().max(255).required("description Is Required"),
        requirements: Yup.string().max(255).required("description Is Required"),
      });
    },
    onSubmit: async (values) => {
      const data = {
        url: values.url,
        description: values.description,
        name: values.name,
        serviceId: values.serviceId,
        cost: values.cost,
        requirements: values.requirements,
      };
      console.log(data);
      createService(data);
    },
  });

  let createServiceModal = (
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
          <TextField
            fullWidth
            label=" description/endpoint"
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

          <TextField
            fullWidth
            type="text"
            label="service Id"
            margin="normal"
            name="serviceId"
            value={formik.values.serviceId}
            variant="outlined"
            error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
            helperText={formik.touched.serviceId && formik.errors.serviceId}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label=" cost "
            margin="normal"
            name="cost"
            type="text"
            value={formik.values.cost}
            variant="outlined"
            error={formik.touched.cost && Boolean(formik.errors.cost)}
            helperText={formik.touched.cost && formik.errors.cost}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label=" requirements "
            margin="normal"
            name="requirements"
            type="text"
            value={formik.values.requirements}
            placeholder="eg:requirment1,requirement2,"
            variant="outlined"
            error={
              formik.touched.requirements && Boolean(formik.errors.requirements)
            }
            helperText={
              formik.touched.requirements && formik.errors.requirements
            }
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
              Create Service
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

  let ServiceDetailModal = (
    <Box>
      <FormControl fullWidth>
        <Card>
          <CardContent>
            <Typography
              component="div"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              gutterBottom
            >
              {selectedService.name}
            </Typography>
            <Typography variant="body2">
              Service ID: {selectedService._id}
              <br />
            </Typography>
            <Typography variant="body2">
              Service Link: {selectedService.url}
              <br />
            </Typography>
            <Typography variant="body2">
              Endpoint name: {selectedService.description}
              <br />
            </Typography>
            <Typography variant="body2">
              {selectedService.requirements?.map((req, i) => (
                <li key={"requirement-" + i}>{req}</li>
              ))}
              <br />
            </Typography>
            <Typography variant="body2">
              Price: {selectedService.cost}
              <br />
            </Typography>
          </CardContent>
        </Card>{" "}
      </FormControl>
    </Box>
  );

  let content = (
    <Box sx={LayoutConfig.defaultContainerSX}>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Detail of service`}
        dialogContent={ServiceDetailModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <EnhancedModal
        isOpen={serviceModal}
        // disableSubmit="true"
        // DialogActions={}
        dialogTitle={`create new service`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setserviceModal(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <Container>
        <br />
        <br />
        <Button
          size="middle"
          variant="contained"
          onClick={() => setserviceModal(true)}
        >
          Create Service
        </Button>
        <br />
        <br />
      </Container>
      <Container>
        <Grid Container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {service.length > 0 ? (
            service.map((ser) => {
              return (
                <Box key={ser._id} mb={4}>
                  <Grid item xs={2} sm={4} md={4}>
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
                            {ser.name}
                          </Typography>
                        </div>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => {
                            setModalIsOpen(true);
                            setSelectedService(ser);
                          }}
                        >
                          Learn More
                        </Button>
                      </CardActions>
                    </Card>{" "}
                  </Grid>
                </Box>
              );
            })
          ) : (
            <Typography>No Data Available</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );

  let Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  let newcontent = (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {service.map((ser, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Item>
              <Typography
                component="div"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                gutterBottom
              >
                {ser.name}
              </Typography>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  let tablecontent = (
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
        data={service}
        title="Job Manager"
        options={{
          ignoreKeys: [
            "deakinSSO",
            "firstLogin",
            "emailVerified",
            "isBlocked",
            "__v",
          ],
        }}
      />
    </Container>
  );
  return (
    <Box sx={LayoutConfig.defaultContainerSX}>
      {content}
      {newcontent}
      {tablecontent}
    </Box>
  );
};
