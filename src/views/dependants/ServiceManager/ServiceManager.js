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
import { LayoutConfig } from "constants/index";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify } from "components/index";
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
    const response = await API.getService();
    setService(response.data.data);
    console.log(response.data.data);
  }, []);

  useEffect(() => {
    getService();
  }, [getService]);

  // const createService = useCallback(async () => {
  //   const response = await API.createService();
  //   console.log(response.data.data);
  // }, []);

  // useEffect(() => {
  //   createService();
  // }, [createService]);

  const createService = async (data) => {
    try {
      const response = await API.createService(data);
      if (response.success) {
        formik.values._id = "";
        formik.values.url = "";
        formik.values.description = "";
        formik.values.name = "";
        formik.values.cost = "";
        formik.values.serviceId = "";
        formik.values.requirements = [];
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
      _id: "",
      url: "",
      description: "",
      name: "",
      cost: "",
      serviceId: "",
      requirements: [],
    },
    validationSchema: () => {
      return Yup.object().shape({
        _id: Yup.string().max(255).required("_id Is Required"),
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
        _id: values._id,
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
            label=" ID "
            margin="normal"
            name="_id"
            type="text"
            value={formik.values._id}
            variant="outlined"
            error={formik.touched._id && Boolean(formik.errors._id)}
            helperText={formik.touched._id && formik.errors._id}
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
              fullWidth
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

  let detailModal = (
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
              Endpoint name: {selectedService.description}
              <br />
            </Typography>
            <Typography variant="body2">
              {/* requirements:{selectedService.requirements} */}
              {/* requirements: */}
              {/* {typeof selectedService.requirements} */}
              {selectedService.requirements?.map((req, i) => (
                <li key={i}>{req}</li>
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
        dialogContent={detailModal}
        options={{
          onClose: () => setModalIsOpen(false),
        }}
      />
      <EnhancedModal
        isOpen={serviceModal}
        dialogTitle={`create new service`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setserviceModal(false),
        }}
      />
      <Container>
        <Button size="large" onClick={() => setserviceModal(true)}>
          Create Service
          <br />
          <br />
        </Button>
      </Container>
      <Container>
        <Grid
          Container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {service.length > 0 ? (
            service.map((ser) => {
              return (
                <Box key={ser._id} item sm={6} mb={4} lg={4} xl={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card width={8}>
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
  return <Box sx={LayoutConfig.defaultContainerSX}>{content}</Box>;
};
