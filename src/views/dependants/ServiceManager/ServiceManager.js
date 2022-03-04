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
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export const ServiceManager = () => {
  const [service, setService] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModal, setserviceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteService, setSelectedDeleteService] = useState("");
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
    const response = await API.deleteService(data.id);
    if (response.success) {
      getService();
    } else {
      notify("delete Object  Failed");
    }
  };
  const createService = async (data) => {
    let requirements = data.requirements.split(",");
    data.requirements = requirements;
    const response = await API.createService(data);
    if (response.success) {
      setserviceModal(false);
      getService();
    } else {
      setserviceModal(false);
      notify("Service Creation Failed!!");
    }
  };

  const initialValues = {
    url: "",
    description: "",
    name: "",
    cost: "",
    requirements: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      url: Yup.string().max(255).required("URL Is Required"),
      description: Yup.string().max(255).required("Description Is Required"),
      name: Yup.string().min(5).max(255).required("Password Is Required"),
      cost: Yup.number().required("Description Is Required"),
      requirements: Yup.string().max(255).required("Description Is Required"),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      url: values.url,
      description: values.description,
      name: values.name,
      serviceId: values.serviceId,
      cost: values.cost,
      requirements: values.requirements,
    };
    createService(data);
    resetForm();
  };
  let deleteConfirmModal = (
    <Box>
      <Typography>Do you want to delete this Job?</Typography>
    </Box>
  );
  let createServiceModal = (
    <Box>
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
              label="Service Name"
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
              label="URL Link"
              margin="normal"
              name="url"
              type="text"
              variant="outlined"
              error={touched.url && Boolean(errors.url)}
              helperText={touched.url && errors.url}
            />
            <Field
              as={TextField}
              fullWidth
              label=" Description/Endpoint"
              margin="normal"
              name="description"
              type="text"
              variant="outlined"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />
            <Field
              as={TextField}
              fullWidth
              label="Cost "
              margin="normal"
              name="cost"
              type="text"
              variant="outlined"
              error={touched.cost && Boolean(errors.cost)}
              helperText={touched.cost && errors.cost}
            />
            <Field
              as={TextField}
              fullWidth
              label="Requirements "
              margin="normal"
              name="requirements"
              type="text"
              placeholder="eg: requirement1,requirement2 "
              variant="outlined"
              error={touched.requirements && Boolean(errors.requirements)}
              helperText={touched.requirements && errors.requirements}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                size="large"
                variant="contained"
                type="submit"
              >
                Create Service
              </Button>
            </Box>
          </Form>
        )}
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
        dialogTitle={`Detail of Service`}
        dialogContent={ServiceDetailModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <EnhancedModal
        isOpen={serviceModal}
        dialogTitle={`Create New Service`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setserviceModal(false),
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
            deleteService(selectedDeleteService), setDeleteModal(false);
          },
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
                label: "remove",
                type: "button",
                function: async (e, data) => {
                  if (!data) return;
                  setSelectedDeleteService(data);
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
  );
  return (
    <Box>
      {content}
      {tablecontent}
    </Box>
  );
};
