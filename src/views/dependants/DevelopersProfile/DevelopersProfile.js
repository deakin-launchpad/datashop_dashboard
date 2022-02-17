import {
  Box,
  Typography,
  CardContent,
  Card,
  Paper,TextField
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import Avatar from '@mui/material/Avatar';
import { useFormik, Formik } from "formik";
  
export const DevelopersProfile = () => {
  const [service, setService] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");

 
  const getDevelopers = useCallback(async () => {
    const response = await API.getDevelopers();
    if (response.success) {
      const res = response.data.data; 
      let result = [];
      res.map((item)=>{
        let newItem ={
          picture:item.picture,
          firstName:item.firstName,
          lastName:item.lastName,
          organization:item.organization,
          description:item.description,
          researchInterests:item.researchInterests,
          services:item.services,
        };
        result.push(newItem);
      });
      setService(result);
    } else {
      setService([]);
      notify("Failed to Fetch Developers List");
    }
  }, []);
  
  useEffect(() => {
    getDevelopers();
  }, [getDevelopers]);
  
  let formik = useFormik({
    initialValues: {
      firstName:'',
      lastName:'',
      description:'',
      organization:'',
      researchInterests:'',
    },
  });
  let DeveloperProfileModal = (
    <Box fullWidth>
      <Formik initialValues={formik.initialValues}>
        <Card>
          <CardContent>
            <Box sx={{justifyContent: 'center',
              alignItems: 'center',mb:2, position:'relative',
              display: 'flex'}}>
              <Avatar sx={{ width: 90, height: 90 }} alt={selectedDeveloper.firstName} src={selectedDeveloper.picture} />
            </Box>
            <Box  sx={{display: 'flex',justifyContent: 'space-between',}}>
              <TextField
                style ={{width: '49%'}}
                label="First Name"
                margin="normal"
                name="firstname"
                type="text"
                disabled
                value={formik.values.firstName}
                variant="outlined"
              />
              <TextField
                disabled
                style ={{width: '49%'}}
                label="Last Name"
                margin="normal"
                name="lastname"
                type="text"
                value={formik.values.lastName}
                variant="outlined"
              /> 
            </Box>
                  
            <TextField
              fullWidth
              disabled
              label="Description"
              margin="normal"
              name="description"
              type="text"
              value={formik.values.description}
              variant="outlined"
              multiline
              rows={4}
            />            
            <TextField
              fullWidth
              disabled
              label="Organization"
              margin="normal"
              name="organization"
              type="text"
              value={formik.values.organization}
              variant="outlined"
            />
            <TextField
              fullWidth
              disabled
              label="Research Interests"
              margin="normal"
              name="researchInterests"
              type="text"
              value={formik.values.researchInterests}
              variant="outlined"
            />   

            <Typography variant="body1" sx={{mt:1,ml:1}}>
              Service created:  
              {selectedDeveloper.services?.map((service, i) => (
                <li key={"service-" + i}>{service.name}</li>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Formik>
    </Box>
  );
  
  let content = (
    <Box>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Developer profile`}
        dialogContent={DeveloperProfileModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
    </Box>
  );
  
  let tablecontent = (
    <Box
      maxWidth="xl"
      sx={{mt:2,ml:4}}
    >
      {service.length > 0 ? <EnhancedTable
        data={service}
        title="Developers"
        options={{
          selector:true,
          ignoreKeys: [
            "__v",
            "picture",
            "userId",
            "updatedAt",
            "createdAt"
          ],
          actions: [
            {
              name: "",
              label: "View",
              type: "button",
              function: async (e, data) => {
                setSelectedDeveloper(data);
                formik.values.firstName = data.firstName;
                formik.values.lastName = data.lastName;
                formik.values.organization = data.organization ?? '';
                formik.values.description = data.description ?? '';
                formik.values.researchInterests = data.researchInterests  ?? '';
                setModalIsOpen(true);
              },
            },
          ],
        }}
      />:<Paper sx={{py:4}}><Typography variant="body1" sx={{textAlign:'center'}}>No Data</Typography></Paper>}
        
    </Box>
  );
  return (
    <Box>
      {content}
      {tablecontent}
    </Box>
  );
};
  