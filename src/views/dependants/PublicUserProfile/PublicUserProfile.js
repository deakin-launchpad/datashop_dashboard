import  { useEffect,useState } from 'react';
import { Box, Container,Typography,Avatar,Button } from "@mui/material";
import { useParams } from 'react-router';
import { API } from 'helpers';
import { notify } from 'components';


export const PublicUserProfile = () => {
  const [services, setServices ] = useState([]);
  const [userName, setUserName] = useState("");
  const [userOrg, setUserOrg] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [userDescription, setDescription] = useState("");
  const [userPicture, setUserPicture] = useState();
  const userId = useParams().userId;

  const getUserProfile = async (userId) => {
    const response = await API.getPublicUserProfile(userId);
    if (response.success) {
      console.log("data3:----",response.data.customerProfile);
      console.log("data4:----",response.data.customerProfile.serviceData.data);
      setServices(response.data.customerProfile.serviceData.data);
      setUserOrg(response.data.customerProfile.organization);
      setUserPicture(response.data.customerProfile.picture);
      setDescription(response.data.customerProfile.description);
      setResearchInterests(response.data.customerProfile.researchInterests);
      setUserName(response.data.customerProfile.firstName+" "+response.data.customerProfile.lastName);
    }
    else {
      notify('Failed to Fetch Users List',null,'warning');
    }
  };
  useEffect(() => {
    getUserProfile(userId);
  }, [userId]);
  const profileTitle = (title) => {
    return (
      <Typography
        variant="body1"
        sx={{
          color: "#7B7B7B",
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 30,
            background: "#79E4F7",
            mr: 1,
            borderRadius: 1,
          }}
        ></Box>{" "}
        {title}
      </Typography>
    );
  };
  let UserProfile = (
    <Box fullWidth>

      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
            position: "relative",
            display: "flex",
          }}
        >
          <Avatar
            sx={{ width: 90, height: 90 }}
            alt={userName}
            src={userPicture}
          />
        </Box>
        <Typography
          sx={{ textAlign: "center", mb: 4 }}
          variant="h6"
          color="#545454"
        >
          {userName.toUpperCase()}
        </Typography>
        {profileTitle("Description")}
        <Typography color="#ABABAB" sx={{ mx: 2, my: 1 }}>
          {userDescription === null
            ? "No description"
            : userDescription}
        </Typography>
        {profileTitle("Organization")}
        <Typography color="#ABABAB" sx={{ mx: 2, my: 1 }}>
          {userOrg === null
            ? "Unknown"
            : userOrg}
        </Typography>
        {profileTitle("Research Interests")}
        <Box sx={{ mx: 2, my: 1 }}>
          {researchInterests === null ? (
            <Typography color="#ABABAB" sx={{ my: 1 }}>
                Unknown
            </Typography>
          ) : (
            <Typography
              component="span"
              sx={{
                background: "#F2F6FE",
                color: "#ABABAB",
                borderRadius: 2,
                py: 1,
                px: 2,
                mt: 1,
              }}
            >
              {researchInterests}
            </Typography>
          )}
        </Box>
        {profileTitle("Service Created")}
        <Box sx={{ mx: 2, my: 1 }}>
          {services.map((service, i) => (
            <Typography
              key={"service-" + i}
              sx={{
                background: "#F2F6FE",
                color: "#ABABAB",
                borderRadius: 1,
                py: 1,
                px: 2,
                mt: 1,
              }}
            >
              {service.name}
            </Typography>
          ))}
        </Box>
        <br></br>
        {" "}
        <Button variant="contained" href="http://thedatashop.club/register">Sign Up to Datashop!</Button>
      </Box>

    </Box>
  );
  // let serviceDisplay = (
  //   <Box maxWidth="xl" sx={{ mt: 2, ml: 4 }}>
  //     {services.length > 0 ? (
  //       <EnhancedTable
  //         data={services}
  //         title="Service Manager"
  //         options={{
  //           selector: true,
  //           ignoreKeys: ["id", "__v","Creator_id"],
  //         }}
  //       />
  //     ):        
  //       <Paper sx={{ py: 4 }}>
  //         <Typography variant="body1" sx={{ textAlign: "center" }}>
  //           No Data
  //         </Typography>
  //       </Paper>}
  //   </Box>
  // );
  return (<Box>
    <Container
      style={{
        margin: 'auto auto'
      }}
      maxWidth="md"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        px: {
          md: '130px !important'
        }
      }}
    >
      <Typography
        color="primary"
        variant="overline"
      >
      Welcome To the Page of {userName} 
      </Typography>
      <Typography
        color="primary"
        variant="overline"
      >

      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="h3"
      >
      </Typography>
      {UserProfile}
      {/* {serviceDisplay} */}
    </Container>
    
  </Box>);
};
