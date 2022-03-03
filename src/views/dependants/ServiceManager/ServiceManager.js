import {
  Box,
  Typography,
  CardContent,
  Card,
  Button,
  TextField,
  FormControl,
  Paper,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const ServiceManager = () => {
  const [service, setService] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModal, setserviceModal] = useState(false);

  const getService = useCallback(async () => {
    const response = await API.getService();
    if (response.success) {
      const res = response.data.data;
      let result = [];
      res.map((item) => {
        let data = {
          name: item.name,
          id: item._id,
          requirments: item.requirements,
          url: item.url,
          description: item.description,
          cost: item.cost,
          creator_id: item.creator_id ?? "null",
        };
        result.push(data);
      });
      setService(result);
    } else {
      setService([]);
      notify("Failed to Fetch Service List");
    }
  }, []);

  useEffect(() => {
    getService();
  }, [getService]);

  const deleteService = async (data) => {
    try {
      const response = await API.deleteService(data.id);
      if (response.success) {
        getService();
      } else {
        notify("delete Object  Failed");
      }
    } catch (err) {
      // creatObjectModal(false);
      console.log(err);
    }
  };
  const createService = async (data) => {
    let requirements = data.requirements.split(",");
    data.requirements = requirements;
    const response = await API.createService(data);
    if (response.success) {
      formik.values.url = "";
      formik.values.description = "";
      formik.values.name = "";
      formik.values.cost = "";
      formik.values.requirements = "";
      setserviceModal(false);
      getService();
    } else {
      setserviceModal(false);
      notify("Service Creation Failed!!");
    }
  };

  let formik = useFormik({
    initialValues: {
      url: "",
      description: "",
      name: "",
      cost: "",
      requirements: "",
    },
    validationSchema: () => {
      return Yup.object().shape({
        url: Yup.string().max(255).required("url Is Required"),
        description: Yup.string().max(255).required("description Is Required"),
        name: Yup.string().min(5).max(255).required("Password Is Required"),
        cost: Yup.number().required("description Is Required"),
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
              Creator ID: {selectedService.creator_id ?? "null"}
              <br />
            </Typography>
            <Typography variant="body2">
              Service ID: {selectedService.id}
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
              Price: ${selectedService.cost}
              <br />
            </Typography>
          </CardContent>
        </Card>
      </FormControl>
    </Box>
  );

  let content = (
    <Box>
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
        dialogTitle={`Create new service`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setserviceModal(false),
          disableSubmit: true,
        }}
      />
      <Box maxWidth="xl" sx={{ textAlign: "right", ml: 4 }}>
        <Button
          size="middle"
          variant="contained"
          onClick={() => setserviceModal(true)}
        >
          Create Service
        </Button>
      </Box>
    </Box>
  );

  let tablecontent = (
    <Box maxWidth="xl" sx={{ mt: 2, ml: 4 }}>
      {service.length > 0 ? (
        <EnhancedTable
          data={service}
          title="Service Manager"
          options={{
            selector: true,
            ignoreKeys: ["id", "__v"],
            actions: [
              {
                name: "",
                label: "View",
                type: "button",
                function: async (e, data) => {
                  setModalIsOpen(true);
                  setSelectedService(data);
                },
              },
              {
                name: "",
                label: "Delete",
                type: "button",
                function: async (e, data) => {
                  deleteService(data);
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
  );
  return (
    <Box>
      {content}
      {tablecontent}
    </Box>
  );
};
