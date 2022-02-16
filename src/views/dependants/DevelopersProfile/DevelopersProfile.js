import {
  Box,
  Typography,
  CardContent,
  Card,
  Paper
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
// import { API } from "helpers";
import { EnhancedModal, notify, EnhancedTable } from "components/index";
import Avatar from '@mui/material/Avatar';
  
export const DevelopersProfile = () => {
  const [service, setService] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");

  const developers =[{
    picture:null,
    fistName:'Qiaoli',
    lastName:'Wang',
    description:'test des',
    rank:10,
    lastServices:'test service',
    servicesCreated:['service1','service2'],
    researchInterests:'AI',
    organization:'deakin',
    datasets:['data1','data2']
  },{
    picture:null,
    fistName:'Qiaoli1',
    lastName:'Wang1',
    description:'test des1',
    rank:10,
    lastServices:'test service1',
    servicesCreated:['service1','service2'],
    researchInterests:'AI1',
    organization:'deakin1',
    datasets:['data1','data2']
  },];
  
  const getDevelopers = useCallback(async () => {
    // const response = await API.getDevelopers();
    // if (response.success) {
    //   const res = response.data.data;     
    //   setService(res);
    // } else {
    //   setService([]);
    //   notify("Failed to Fetch Developers List");
    // }
    if(developers.length> 0){
      setService(developers);
    }else{
      setService([]);
      notify("Failed to Fetch Developers List");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    getDevelopers();
  }, [getDevelopers]);
  
  
  let DeveloperProfileModal = (
    <Box fullWidth>
      <Card>
        <CardContent>
          {selectedDeveloper.picture !== null ? 
            <Avatar alt={selectedDeveloper.fistName} src={selectedDeveloper.picture} /> : <Avatar>{`${selectedDeveloper.fistName}`.substring(0,1)}</Avatar>}  
          <Typography>
            {selectedDeveloper.description}
          </Typography>
          <Typography variant="body2">
            First Name: {selectedDeveloper.fistName}
          </Typography>
          <Typography variant="body2">
            Last Name: {selectedDeveloper.lastName}
          </Typography>
          <Typography>
            Organization: {selectedDeveloper.organization}
          </Typography>
          <Typography variant="body2">
            Research Interests: {selectedDeveloper.researchInterests}
          </Typography>
          <Typography variant="body2">
            Rank: {selectedDeveloper.rank}
          </Typography>
          <Typography variant="body2">
            Last Service: {selectedDeveloper.lastServices}
          </Typography>
          <Typography variant="body2">
             Service created:  
            {selectedDeveloper.servicesCreated?.map((service, i) => (
              <li key={"service-" + i}>{service}</li>
            ))}
          </Typography>
          <Typography variant="body2">
             Datasets:  
            {selectedDeveloper.datasets?.map((dataset, i) => (
              <li key={"datasets-" + i}>{dataset}</li>
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
            "picture"
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
  