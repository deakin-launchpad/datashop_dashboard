
import { Box, Container, Typography,Card,CardContent,Grid } from '@mui/material';
import { API } from "helpers";
import { useState, useCallback, useEffect } from "react";
import * as React from 'react';
import {notify } from "components/index";


export const Home = () => {
  const [developers, setDevelopers] = useState([]);
  const [jobCount, setJobCount] = useState("");
  const [jobs, setJobs] = useState([]);
  const [serviceCount, setserviceCount] = useState("");
  const [services, setservices] = useState([]);
  const getInfo = useCallback(async () => {
    const response = await API.getInfo();
    if (response.success) {
      console.log("all----",response);
      console.log("serviceCount",response.data.serviceCount);
      setserviceCount(response.data.serviceCount);
      console.log("services:",response.data.services);
      setservices(response.data.services);
      console.log("Job count",response.data.jobCount);
      setJobCount(response.data.jobCount);
      console.log("jobs",response.data.jobs);
      setJobs(response.data.jobs);
      console.log("developers",response.data.developers);
      setDevelopers(response.data.developers);

    } else {
      notify("Failed to Fetch info List",null,'warning');
    }
  }, []);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  let devloperInfo=(
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
        Developer number: {developers.length}
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
        Lastest Joined: {developers.slice(0,3).map((item)=> {return(
            <Typography
              key={item._id}
              component="div"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              gutterBottom
            >
            Developer Name: {item.firstName+" "+item.lastName}
            </Typography>
          );})}
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  let jobInfo=(
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
      Job Created: {jobCount}
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
        Lastest Added: {jobs.slice(0,3).map((item)=> {return(
            <Typography
              key={item._id}
              component="div"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              gutterBottom
            >
            Job Name: {item.jobName}
            </Typography>
          );})}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
  let serviceInfo=(
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
    Services Added: {serviceCount}
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
        Lastest Added: {services.slice(0,3).map((item)=> {return(
            <Typography
              key={item._id}
              component="div"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              gutterBottom
            >
            Service Name: {item.name}
            </Typography>
          );})}
        </Typography>
      </CardContent>
    </React.Fragment>
  );




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
        Welcome To
      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="h3"
      >
        DataShop Dashboard
      </Typography>
      <Typography
        align="center"
        color="textSecondary"
        variant="body1"
        sx={{ py: 3 }}
      >
        To explore more visit the examples tab on the left
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={10}><Card variant="outlined">{jobInfo}</Card></Grid>
        <Grid item xs={10}><Card variant="outlined">{serviceInfo}</Card></Grid>
        <Grid item xs={10}><Card variant="outlined">{devloperInfo}</Card></Grid>
      </Grid>
    </Container>
  </Box>);
};
