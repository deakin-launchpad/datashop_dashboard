import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import Avatar from '@mui/material/Avatar';
import ContactPageIcon from '@mui/icons-material/ContactPage';
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
  const profileTitle = (title)=>{
    return <Typography variant="body1" sx={{color:'#7B7B7B',display:'flex',alignItems:'center',fontSize:'18px',mt:2}}><Box sx={{width:6,height:30,background:'#79E4F7',mr:1,borderRadius:1}}></Box> {title}</Typography>;
  };
  let DeveloperProfileModal = (
    <Box fullWidth>
      <Formik initialValues={formik.initialValues}>
        <Box sx={{px:2}}>
          <Box sx={{justifyContent: 'center',
            alignItems: 'center',mb:1, position:'relative',
            display: 'flex'}}>
            <Avatar sx={{ width: 90, height: 90 }} alt={selectedDeveloper.firstName} src={selectedDeveloper.picture} />
          </Box>
          <Typography sx={{textAlign:'center',mb:4}} variant="h6" color="#545454">
            {formik.values.firstName.toUpperCase()} {formik.values.lastName.toUpperCase()}
          </Typography>
          {profileTitle('Description')}
          <Typography color="#ABABAB" sx={{mx:2,my:1}}>{formik.values.description === '' ? 'No description': formik.values.description}</Typography>
          {profileTitle('Organization')}
          <Typography color="#ABABAB" sx={{mx:2,my:1}}>{formik.values.organization === '' ? 'Unknown': formik.values.organization}</Typography>
          {profileTitle('Research Interests')}
          <Typography color="#ABABAB" sx={{mx:2,my:1}}>{formik.values.researchInterests === '' ? 'Unknown': formik.values.researchInterests}</Typography>
          {profileTitle('Service Created')}
          <Box sx={{mx:2,my:1}}>
            {selectedDeveloper.services?.map((service, i) => (
              <Typography  key={"service-" + i} sx={{background:'#F2F6FE',color:'#ABABAB',borderRadius:1,py:1,px:2,mt:1}} >{service.name}</Typography>
            ))}
          </Box>
        </Box>
      </Formik>
    </Box>
  );
  
  let content = (
    <Box>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={<ContactPageIcon color="primary"/>}
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
  