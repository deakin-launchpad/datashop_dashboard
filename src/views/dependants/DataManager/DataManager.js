import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify, EnhancedModal } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { Box, Container, Button } from "@mui/material";
import { useFormik, Formik } from "formik";
// import { TextField } from "../../../../node_modules/@mui/material/index";
// import * as Yup from "yup";

export const DatasetsManager = () => {
  const [datasets, setDatasets] = useState([]);
  const [uploadData, setUploaData] = useState("");
  const isMounted = useIsMountedRef();
  const [dataModalOpen, setDataModalOpen] = useState(false);

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

  const uploadDataset = async (data) => {
    console.log(data, "dt");
    try {
      const response = await API.uploadDatasets(data);
      if (response.success) {
        formik.values.dataset = "";
        // formik.values.description = "";
        setDataModalOpen(false);
        getDatasets();
      } else {
        notify("Data Uploading Failed!!");
      }
    } catch (err) {
      setDataModalOpen(false);
    }
  };

  const handleChange = (e) => {
    setUploaData(e.target.files[0]);
    uploadDataset(uploadData);
  };

  let formik = useFormik({
    initialValues: {
      dataset: "",
    },

    onSubmit: async (values) => {
      const data = {
        dataset: values.dataset,
        // description: values.description,
      };
      console.log("aaaaaaa", data);
      uploadDataset(data);
    },
  });

  let uploadDataModal = (
    <Box>
      {" "}
      <Formik initialValues={formik.initialValues}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <input
            // fullWidth
            id="uploadData"
            name="uploadData"
            type="file"
            value={formik.values.dataset}
            variant="outlined"
            error={formik.touched.dataset && Boolean(formik.errors.dataset)}
            // helperText={formik.touched.dataset && formik.errors.dataset}
            onBlur={formik.handleBlur}
            onChange={handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              size="middle"
              variant="contained"
              type="submit"
            >
              Upload
            </Button>
          </Box>
        </form>
      </Formik>
    </Box>
  );

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
        dialogTitle={`upload new data`}
        dialogContent={uploadDataModal}
        options={{
          onClose: () => setDataModalOpen(false),
          disableSubmit: true,
          disableClose: true,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: "100px",
            sm: window.screen.availHeight / 50,
          },
        }}
      >
        <Button
          // size="middle"
          variant="contained"
          onClick={() => setDataModalOpen(true)}
        >
          Upload Data
        </Button>
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
            ],
          }}
        />
      </Container>
    </Box>
  );
  return content;
};
