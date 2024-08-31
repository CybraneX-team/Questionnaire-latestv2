import React from "react";
import { Box, Button } from "@mui/material";
import ProgressCircles from "./ProgressCircles";
import BarChart from "./BarChart";
import RadarChart from "./radarChart";
import "./styles.css";
const CommonComponent = ({ handleNext, section }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      minWidth="100vw"
      bgcolor="white"
      p={2}
    >
      {" "}
      <p className="font-extrabold text-white">{section}</p>{" "}
      <Box
        width={{ xs: "90%", sm: "70%", md: "60%", lg: "50%" }}
        maxWidth="800px"
        maxHeight="70vh"
        p={2}
        bgcolor="#E5FFFC"
        borderRadius="8px"
        display="flex"
        justifyContent="center"
      >
        {" "}
        <ProgressCircles /> <RadarChart />{" "}
      </Box>{" "}
      {/* <Button         variant="contained"         onClick={handleNext}         style={{           backgroundColor: "#449082",           color: "white",           marginTop: "20px",           width: "200px",           height: "40px",           fontSize: "16px",           display: "block",           margin: "20px auto 40px auto",           border: "1px solid #449082",           boxShadow: "none",         }}       >         Next       </Button> */}{" "}
      <button
        className="next-button"
        variant="contained"
        onClick={handleNext}
        style={{ marginTop: "20px" }}
      >
        {" "}
        <span className="label">Next</span>{" "}
        <span className="icon">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            {" "}
            <path fill="none" d="M0 0h24v24H0z"></path>{" "}
            <path
              fill="currentColor"
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            ></path>{" "}
          </svg>{" "}
        </span>{" "}
      </button>{" "}
    </Box>
  );
};
export default CommonComponent;
