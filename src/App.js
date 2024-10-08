import React, { useState } from "react";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Questionnaire from "./components/Questionnaire";
import Signup from "./components/Signup";
import Report from "./components/report";
import ChartComponent from "./components/chart";
import InputReport from "./components/inputReport";
import FormAfter from "./components/FormAfter";
import Choropleth from "./components/choropleth";
import ReportPdf from "./components/ReportPdf";
//<Route path="/report" element={<Report img={img} />} />

const App = () => {
  const [img, setImage] = useState("");
  const handleImage = (imgData) => {
    setImage(imgData);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/questionnare" element={<Questionnaire />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/chart" element={<ChartComponent />} />

        <Route path="/report" element={<FormAfter />} />
        <Route path="/reportPdf" element={<ReportPdf />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
