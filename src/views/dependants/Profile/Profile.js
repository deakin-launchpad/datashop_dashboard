import { Box, InputLabel, TextField, Button, Paper, Grid } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { notify } from "components/index";
import Avatar from "@mui/material/Avatar";
import UploadIcon from "@mui/icons-material/Upload";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [initialValue, setInitialValue] = useState({
    firstName: "",
    lastName: "",
    description: "",
    organization: "",
    researchInterests: "",
  });
  const [editing, setEditing] = useState(false);

  const pictureChangeHandle = async (event) => {
    if (event.target.files[0]) {
      const formData = new FormData();
      formData.append("imageFile", event.target.files[0]);
      const response = await API.uploadImage(formData);
      if (response.success) {
        setProfilePicture(response.data.imageFileURL.original);
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: () => {
      return Yup.object().shape({
        firstName: Yup.string().max(255).required("First Name is required"),
        lastName: Yup.string().max(255).required("Last Name is required"),
      });
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      const dataToSend = {
        firstName: values.firstName,
        lastName: values.lastName,
        description: values.description,
        organization: values.organization ?? "",
        picture: profilePicture ?? "",
        researchInterests: values.researchInterests ?? "",
      };
      const response = await API.editUserProfile(dataToSend);
      if (response.success) {
        notify("profile updated!",null,'success');
        getUserProfile();
        setEditing(false);
      }
      setStatus(true);
      setSubmitting(false);
    },
  });

  const getUserProfile = useCallback(async () => {
    const response = await API.getUserProfile();
    if (response.success) {
      const res = response.data.customerProfile;
      const _initialValues = {
        firstName: res.firstName,
        lastName: res.lastName,
        description: res.description,
        organization: res.organization,
        researchInterests: res.researchInterests,
      };
      setInitialValue(_initialValues);
      setCurrentUser(res);
      setProfilePicture(res.picture);
    } else {
      setCurrentUser({});
      notify("Failed to Fetch User Profile",null,'warning');
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  let userProfileForm = (
    <Formik enableReinitialize={true} initialValues={formik.initialValue}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            position: "relative",
            display: "flex",
          }}
        >
          <Avatar
            sx={{ width: 90, height: 90 }}
            alt={currentUser.firstName}
            src={profilePicture}
          />
          {editing ? (
            <Box sx={{ position: "absolute", width: 90, height: 90 }}>
              {" "}
              <UploadIcon
                sx={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  color: "rgba(192,192,192,.5)",
                }}
              />
              <input
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  opacity: 0,
                }}
                type="file"
                onChange={pictureChangeHandle}
              ></input>
            </Box>
          ) : null}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            {editing ? (
              <TextField
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First Name"
                margin="normal"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.firstName}
                variant="outlined"
              />
            ) : (
              <Box>
                <InputLabel htmlFor="firstName">First Name</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  name="firstName"
                  placeholder="first name"
                  type="text"
                  value={currentUser.firstName}
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            {editing ? (
              <TextField
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Last Name"
                margin="normal"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.lastName}
                variant="outlined"
              />
            ) : (
              <Box>
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  name="lastName"
                  placeholder="last name"
                  type="text"
                  value={currentUser.lastName}
                  disabled
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {editing ? (
          <TextField
            error={
              formik.touched.organization && Boolean(formik.errors.organization)
            }
            fullWidth
            helperText={
              formik.touched.organization && formik.errors.organization
            }
            label="Organization"
            margin="normal"
            name="organization"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.organization}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="organization">Organization</InputLabel>
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="organization"
              placeholder="Organization"
              type="text"
              value={currentUser.organization}
              variant="outlined"
            />
          </Box>
        )}
        {editing ? (
          <TextField
            error={
              formik.touched.researchInterests &&
              Boolean(formik.errors.researchInterests)
            }
            fullWidth
            helperText={
              formik.touched.researchInterests &&
              formik.errors.researchInterests
            }
            label="Research Interests"
            margin="normal"
            name="researchInterests"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.researchInterests}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="researchInterests">
              Research Interests
            </InputLabel>
            <TextField
              disabled
              fullWidth
              placeholder="Research Interests"
              margin="normal"
              name="researchInterests"
              type="text"
              value={currentUser.researchInterests}
              variant="outlined"
            />
          </Box>
        )}
        {editing ? (
          <TextField
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            multiline
            rows={4}
            value={formik.values.description}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextField
              disabled
              fullWidth
              placeholder="Description"
              margin="normal"
              name="description"
              type="text"
              multiline
              rows={4}
              value={currentUser.description}
              variant="outlined"
            />
          </Box>
        )}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            sx={{ px: 5, mr: 4 }}
            color="secondary"
            disabled={formik.isSubmitting}
            size="large"
            type="button"
            variant="contained"
            onClick={() => {
              formik.values.firstName = currentUser.firstName;
              formik.values.lastName = currentUser.lastName;
              formik.values.description = currentUser.description;
              formik.values.organization = currentUser.organization;
              formik.values.researchInterests = currentUser.researchInterests;
              setEditing(!editing);
            }}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button
            sx={{ px: 5 }}
            color="primary"
            disabled={formik.isSubmitting}
            size="large"
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Formik>
  );
  return (
    <Box sx={{ ml: 4 }}>
      <Paper elevation={2} sx={{ py: 3, px: 12 }}>
        {userProfileForm}
      </Paper>
    </Box>
  );
};
