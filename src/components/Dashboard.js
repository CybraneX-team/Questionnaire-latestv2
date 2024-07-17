import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Collapse,
} from "@mui/material";
import "./Dashboard.css";
import { Add as AddIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import PrintIcon from "./directbox-notif.svg";
import Design from "./icon.svg";
import { useNavigate } from "react-router-dom";
import { getQList, getNewQ } from "../api";
import { qStore, jwtStore } from "../redux/store";
import { formatTimeStamp } from "../utils/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(jwtStore.getState());
  const [questionnare, setQues] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(() => {
    const savedCollapse = localStorage.getItem("collapse");
    return savedCollapse === "true" || false;
  });

  const handleToggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
    localStorage.setItem("collapse", !collapseOpen);
  };

  useEffect(() => {
    if (!collapseOpen) {
      localStorage.setItem("collapse", "false");
    } else {
      localStorage.setItem("collapse", "true");
    }
  }, [collapseOpen]);

  // useEffect(() => {
  //   if (localStorage.getItem("collapse") && !collapseOpen) {
  //     localStorage.setItem("collapse", 0);
  //   }
  // }, [collapseOpen]);

  const CustomCard = styled(Card)(({ theme }) => ({
    borderRadius: "2rem",
    boxShadow: "none",
    backgroundColor: "#DFFFEC",
    padding: theme.spacing(2),
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "DM Sans",
  }));

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4D6F74",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#3D5F64",
    },
    borderRadius: "8px",
    height: "35px",
    fontSize: "14px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    margin: "0",
    marginRight: "18px",
    fontFamily: "DM Sans",
    textTransform: "none",
  }));

  const CustomIconButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4D6F74",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#3D5F64",
    },
    borderRadius: "8px",
    width: "35px",
    height: "35px",
    fontSize: "12px",
    padding: "0",
    minWidth: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "-20px",
    fontFamily: "DM Sans",
  }));

  const NewCard = styled(Card)(({ theme }) => ({
    borderRadius: "2rem",
    boxShadow: "none",
    backgroundColor: "#DFFFEC",
    padding: theme.spacing(2),
    width: "100%",
    height: "630px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontFamily: "DM Sans",
  }));

  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#3DEDC3",
    },
    backgroundColor: "#B2EBE1",
  }));

  const DashboardTitle = styled(Typography)(({ theme }) => ({
    color: "#2A2A2A",
    fontWeight: "normal",
  }));

  const CreateNewButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4D6F74",
    color: "#000",
    "&:hover": {
      backgroundColor: "#3D5F64",
    },
    borderRadius: "8px",
    height: "35px",
    fontSize: "14px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    margin: "0",
    fontFamily: "DM Sans",
  }));

  const fetchQuestionnare = async (jwt) => {
    try {
      let res = await getQList(jwt);
      console.log(res);
      setQues(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch questionnaires", error);
      setQues([]);
    }
  };

  const handleNew = async () => {
    let res = await getNewQ(jwt);
    qStore.dispatch({
      type: "questionnaire",
      payload: res.data,
    });
    navigate(`/questionnare?id=${res.qid}`);
  };

  function handleLogout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("collapse");
    navigate("/");
  }

  useEffect(() => {
    const unsubscribe = jwtStore.subscribe(() => {
      const newJwt = jwtStore.getState();
      setJwt(newJwt);
      if (newJwt) {
        fetchQuestionnare(newJwt);
      }
    });

    if (jwt) {
      fetchQuestionnare(jwt);
    }

    return () => {
      unsubscribe();
    };
  }, [jwt]);

  useEffect(() => {
    if (!jwt) {
      if (localStorage.getItem("jwt")) {
        setJwt(localStorage.getItem("jwt"));
      } else {
        navigate("/");
      }
    }
  }, []);

  return (
    <div style={{ padding: "32px", fontFamily: "DM Sans" }}>
      <button
        className=" top-8 left-10 bg-dashred text-white p-2 rounded-lg mb-2 ml-2"
        style={{
          backgroundColor: "#4D6F74",
          color: "#FFF",
          fontFamily: "DM Sans",
        }}
        onClick={handleToggleCollapse}
      >
        {collapseOpen ? "Close" : "Info"}
      </button>
      <Collapse in={collapseOpen} className=" ">
        <DashboardTitle
          variant="h5"
          style={{
            color: "#4D4556",
            fontWeight: "bold",
            marginBottom: "20px",
            marginLeft: "10px",
          }}
        >
          Introduction to SIMs
        </DashboardTitle>
        <Typography variant="subtitle1" className=" pl-2 pr-48 pb-5">
          The questions here are tuned for larger organisations in the private
          sector, or a significant project run within a for-profit environment.
          Depending on your answers, you will typically be asked 50-80
          questions, taking 90-120 minutes start to finish. Within the app, you
          can add references from Google or PDF documents that you upload, to
          save you time. If you need to leave part-way, e.g. to conduct
          additional research, your progress is automatically saved so you can
          continue on another session. You can create a report at the end that
          can be edited and used to guide your organisation’s decision-making
          process. To find out more, click here.
        </Typography>
      </Collapse>

      <DashboardTitle
        variant="h5"
        style={{
          color: "#4D4556",
          fontWeight: "bold",
          marginBottom: "20px",
          marginLeft: "10px",
        }}
      >
        Dashboard
      </DashboardTitle>
      <button
        className="absolute right-10 top-8 bg-dashred text-white p-2 rounded-lg"
        style={{
          backgroundColor: "#4D6F74",
          color: "#FFF",
          fontFamily: "DM Sans",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {questionnare.map((card, index) => (
            <CustomCard key={index}>
              <CardContent style={{ flex: "1 0 auto" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: "#35483F" }}
                >
                  {card.data[0].answers}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ color: "#35483F" }}
                >
                  {formatTimeStamp(card.utctimestamp)}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    color: "#35483F",
                  }}
                >
                  {card.progress}% Completed
                </Typography>
                <CustomLinearProgress
                  variant="determinate"
                  value={card.progress}
                  style={{ marginBottom: "16px" }}
                />
              </CardContent>
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "8px",
                }}
              >
                <CustomButton
                  size="small"
                  style={{
                    marginLeft: "40px",
                    bottom: "-25px",
                    fontFamily: "DM Sans",
                  }}
                  onClick={() => {
                    qStore.dispatch({
                      type: "questionnaire",
                      payload: card,
                    });
                    navigate(`/questionnare?id=${card.qid}`);
                  }}
                >
                  Continue
                  <img
                    src={Design}
                    alt="Print"
                    style={{ marginLeft: "5px", width: "15px", height: "15px" }}
                  />
                </CustomButton>
                <CustomIconButton size="small" style={{ bottom: "-25px" }}>
                  <img
                    src={PrintIcon}
                    alt="Print"
                    style={{ width: "20px", height: "20px" }}
                  />
                </CustomIconButton>
              </CardContent>
            </CustomCard>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <NewCard style={{ width: "500px" }}>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                style={{ color: "#35483F", marginRight: "5px" }}
              >
                Create New
              </Typography>
              <CreateNewButton
                style={{ width: "30px", height: "30px" }}
                onClick={() => {
                  handleNew();
                }}
              >
                <AddIcon fontSize="small" style={{ color: "white" }} />
              </CreateNewButton>
            </CardContent>
            <Typography
              variant="body2"
              style={{
                marginTop: "-10px",
                color: "#35483F",
                marginLeft: "15px",
              }}
            >
              Start a new Questionnaire
            </Typography>
          </NewCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
