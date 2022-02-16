import {
  Box,
  Typography,
  CardContent,
  Card,
  Paper
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import Avatar from '@mui/material/Avatar';
  
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
          firstName:item.firstName,
          lastName:item.lastName,
          organization:item.organization,
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
  
  
  let DeveloperProfileModal = (
    <Box fullWidth>
      <Card>
        <CardContent>
          {selectedDeveloper.picture !== null ? 
            <Avatar alt={selectedDeveloper.firstName} src={selectedDeveloper.picture} /> : <Avatar>{`${selectedDeveloper.firstName}`.substring(0,1)}</Avatar>}  
          <Typography>
            {selectedDeveloper.description}
          </Typography>
          <Typography variant="body2">
            First Name: {selectedDeveloper.firstName}
          </Typography>
          <Typography variant="body2">
            Last Name: {selectedDeveloper.lastName}
          </Typography>
          <Typography  variant="body2">
            Organization: {selectedDeveloper.organization}
          </Typography>
          <Typography variant="body2">
            Research Interests: {selectedDeveloper.researchInterests}
          </Typography>

          <Typography variant="body2">
             Service created:  
            {selectedDeveloper.services?.map((service, i) => (
              <li key={"service-" + i}>{service.name}</li>
            ))}
          </Typography>
        </CardContent>
      </Card>
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
                setModalIsOpen(true);
                setSelectedDeveloper(data);
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
  