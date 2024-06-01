import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Questionnaire from "./components/Questionnaire";
import Signup from "./components/Signup";
import Report from "./components/report";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/questionnare" element={<Questionnaire />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
