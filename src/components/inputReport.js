import { TextField, Typography } from "@mui/material";
import React from "react";

function InputReport() {
  return (
    <div className="m-5">
      <Typography variant="h3">Global Company LLC</Typography>
      <Typography variant="subtitle1">
        Time frame of analysis: 2024-2029
      </Typography>
      <div className=" my-10 flex flex-row items-baseline justify-between max-w-sm">
        <Typography variant="body1">Report Summary:</Typography>
        <TextField
          label="Report Summary"
          multiline
          rows={4}
          sx={{ widows: "0.7vw" }}
        />
      </div>
    </div>
  );
}

export default InputReport;
