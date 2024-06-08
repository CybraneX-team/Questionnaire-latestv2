import React from "react";
import { Box, Button } from "@mui/material";
import ProgressCircles from "./ProgressCircles";
import BarChart from "./BarChart";
import RadarChart from "./radarChart";

const CommonComponent = ({ handleNext, section }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      minWidth="200vh"
      bgcolor="white"
    >
      <p className=" font-extrabold text-white">{section}</p>
      <Box
        width="50%"
        maxWidth="800px"
        mb={4}
        p={2}
        bgcolor="#E5FFFC"
        borderRadius="8px"
      >
        <BarChart />
      </Box>
      <Box
        width="90%"
        maxWidth="800px"
        p={2}
        bgcolor="#E5FFFC"
        borderRadius="8px"
      >
        <ProgressCircles />
        {/* <RadarChart /> */}
      </Box>
      <Button
        variant="contained"
        onClick={handleNext}
        style={{
          backgroundColor: "#449082",
          color: "white",
          marginTop: "20px",
          width: "200px",
          height: "40px",
          fontSize: "16px",
          display: "block",
          margin: "20px auto 40px auto",
          border: "1px solid #449082",
          boxShadow: "none",
        }}
        >
        Next
      </Button>
    </Box>
  );
};

export default CommonComponent;
