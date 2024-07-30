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
import Design from "./icon.svg";
import { useNavigate } from "react-router-dom";
import { getQList, getNewQ } from "../api";
import { qStore, jwtStore } from "../redux/store";
import { formatTimeStamp } from "../utils/utils";
import PrintIcon from '@mui/icons-material/Print';

const Dashboard = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(jwtStore.getState());
  const [questionnare, setQues] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(() => {
    const savedCollapse = localStorage.getItem("collapse");
    return savedCollapse === "true" || false;
  });
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  // const [collapseOpen, setCollapseOpen] = useState(false);

  const handleToggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  useEffect(() => {
    if (!collapseOpen) {
      localStorage.setItem("collapse", "false");
    } else {
      localStorage.setItem("collapse", "true");
    }
  }, [collapseOpen]);


  useEffect(() => {
    if (localStorage.getItem("collapse") && !collapseOpen) {
      localStorage.setItem("collapse", 0);
    }
  }, [collapseOpen]);

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

  // const CustomButton = styled(Button)(({ theme }) => ({
  //   backgroundColor: "#4D6F74",
  //   color: "#FFF",
  //   "&:hover": {
  //     backgroundColor: "#3D5F64",
  //   },
  //   borderRadius: "8px",
  //   height: "35px",
  //   fontSize: "14px",
  //   padding: "0 16px",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   minWidth: "auto",
  //   margin: "0",
  //   marginRight: "18px",
  //   fontFamily: "DM Sans",
  //   textTransform: "none",
  // }));

  const CustomButton = styled("button")({
    background: "#3d5f64",
    color: "white",
    fontFamily: "inherit",
    padding: "0.35em",
    paddingLeft: "1.2em",
    fontSize: "14px",
    fontWeight: 500,
    marginRight: "18px",
    borderRadius: "0.9em",
    border: "none",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    boxShadow: "inset 0 0 1.6em -0.6em #714da6",
    overflow: "hidden",
    position: "relative",
    height: "35px",
    paddingRight: "3.3em",
    cursor: "pointer",
    ".icon": {
      background: "white",
      marginLeft: "1em",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "2.2em",
      width: "2.2em",
      borderRadius: "0.7em",
      boxShadow: "0.1em 0.1em 0.6em 0.2em #3d5f64",
      right: "0.3em",
      transition: "all 0.3s",
    },
    "&:hover .icon": {
      width: "calc(100% - 0.6em)",
    },
    ".icon svg": {
      width: "1.1em",
      transition: "transform 0.3s",
      color: "#3d5f64",
    },
    "&:hover .icon svg": {
      transform: "translateX(0.1em)",
    },
    "&:active .icon": {
      transform: "scale(0.95)",
    },
  });

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
    <div style={{ padding: "32px", fontFamily: "Montserrat" }}>
      <button
        className="closeInfo-btn top-8 left-10 bg-dashred text-white p-2 rounded-lg mb-2 ml-2"
        style={{
          backgroundColor: "#4D6F74",
          color: "#FFF",
          fontFamily: "Montserrat",
        }}
        onClick={handleToggleCollapse}
      >
        {collapseOpen ? (
          <>
            <span className="span-mother">
              <span>I</span>
              <span>N</span>
              <span>F</span>
              <span>O</span>
            </span>
            <span className="span-mother2">
              <span>C</span>
              <span>L</span>
              <span>O</span>
              <span>S</span>
              <span>E</span>
            </span>

          </>
        ) : (
          <>
            <span className="span-mother">
              <span>C</span>
              <span>L</span>
              <span>O</span>
              <span>S</span>
              <span>E</span>
            </span>
            <span className="span-mother2">
              <span>I</span>
              <span>N</span>
              <span>F</span>
              <span>O</span>
            </span>
          </>
        )}
        {/* {collapseOpen ? "Close" : "Info"} */}
      </button>
      <Collapse in={collapseOpen} className=" ">
        <DashboardTitle
          variant="h3"
          style={{
            color: "#4D4556",
            fontWeight: "bold",
            fontFamily: "Montserrat",
            marginBottom: "20px",
            marginLeft: "10px",
          }}
        >
          Introduction to SIMs
        </DashboardTitle>
        <Typography variant="subtitle1" className=" pl-2 pr-48 pb-5" style={{ fontFamily: "Hind" }}>
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
          fontFamily: "Montserrat",
          fontWeight: "bold",
          marginBottom: "20px",
          marginLeft: "10px",
        }}
      >
        Dashboard
      </DashboardTitle>
      {/* <button
        className="absolute right-10 top-8 bg-dashred text-white p-2 rounded-lg"
        style={{
          backgroundColor: "#4D6F74",
          color: "#FFF",
          fontFamily: "DM Sans",
        }}
        onClick={handleLogout}
      >
        Logout
      </button> */}
      <button className="Btn" onClick={handleLogout}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className="text">Logout</div>
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
                  {(card.position / card.data.length).toFixed(1) * 100}%
                  Completed
                </Typography>
                <CustomLinearProgress
                  variant="determinate"
                  value={(card.position / card.data.length).toFixed(1) * 100}
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
                {/* <CustomButton
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
                </CustomButton> */}
                <CustomButton
                  size="small"
                  style={{
                    marginLeft: "40px",
                    bottom: "-25px",
                    fontFamily: "Montserrat",
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
                  <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </CustomButton>
                <CustomIconButton size="small" style={{ bottom: "-25px" }}>
                  <PrintIcon />
                </CustomIconButton>
                {/* <div className="printer">
                  <div className="paper">
                    <svg viewBox="0 0 8 8" className="svg">
                      <path fill="#4d6f74" d="M6.28951 1.3867C6.91292 0.809799 7.00842 0 7.00842 0C7.00842 0 6.45246 0.602112 5.54326 0.602112C4.82505 0.602112 4.27655 0.596787 4.07703 0.595012L3.99644 0.594302C1.94904 0.594302 0.290039 2.25224 0.290039 4.29715C0.290039 6.34206 1.94975 8 3.99644 8C6.04312 8 7.70284 6.34206 7.70284 4.29715C7.70347 3.73662 7.57647 3.18331 7.33147 2.67916C7.08647 2.17502 6.7299 1.73327 6.2888 1.38741L6.28951 1.3867ZM3.99679 6.532C2.76133 6.532 1.75875 5.53084 1.75875 4.29609C1.75875 3.06133 2.76097 2.06018 3.99679 2.06018C4.06423 2.06014 4.13163 2.06311 4.1988 2.06905L4.2414 2.07367C4.25028 2.07438 4.26057 2.0758 4.27406 2.07651C4.81533 2.1436 5.31342 2.40616 5.67465 2.81479C6.03589 3.22342 6.23536 3.74997 6.23554 4.29538C6.23554 5.53084 5.23439 6.532 3.9975 6.532H3.99679Z"></path>
                      <path fill="#0055BB" d="M6.756 1.82386C6.19293 2.09 5.58359 2.24445 4.96173 2.27864C4.74513 2.17453 4.51296 2.10653 4.27441 2.07734C4.4718 2.09225 5.16906 2.07947 5.90892 1.66374C6.04642 1.58672 6.1743 1.49364 6.28986 1.38647C6.45751 1.51849 6.61346 1.6647 6.756 1.8235V1.82386Z"></path>
                    </svg>
                  </div>
                  <div className="dot"></div>
                  <div className="output">
                    <div className="paper-out"></div>
                  </div>
                </div> */}
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
          <NewCard style={{ width: "250px", height: "160px" }}>
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
                style={{
                  fontFamily: "Montserrat",
                  color: "#35483F",
                  marginRight: "12px",
                  fontWeight: "bold",
                }}
              >
                Create New
              </Typography>
              {/* <CreateNewButton
                style={{ width: "30px", height: "30px" }}
                onClick={() => {
                  handleNew();
                }}
              >
                <AddIcon fontSize="small" style={{ color: "white" }} />
              </CreateNewButton> */}

              <button
                className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                title="Add New"
                onClick={() => {
                  handleNew();
                }}
              >
                <svg
                  className="stroke-teal-500 fill-none group-hover:fill-teal-700 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                  viewBox="0 0 24 24"
                  height="50px"
                  width="50px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-width="1.5"
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  ></path>
                  <path stroke-width="1.5" d="M8 12H16"></path>
                  <path stroke-width="1.5" d="M12 16V8"></path>
                </svg>
              </button>
            </CardContent>
            <Typography
              variant="body2"
              style={{
                // marginTop: "10px",
                color: "#35483F",
                fontFamily: "Hind",
                fontSize: "18px",
                marginLeft: "10px",
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
