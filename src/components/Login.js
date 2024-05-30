import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowForward } from "@mui/icons-material";
import wave from "./wave.svg";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { jwtStore } from "../redux/store";

const Container = styled(Box)({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  position: "relative",
});

const LeftPane = styled(Box)({
  width: "40%",
  background: `url(${wave}) no-repeat`,
  backgroundSize: "cover",
});

const RightPane = styled(Box)({
  width: "60%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

const WelcomeText = styled(Typography)({
  position: "absolute",
  top: "50px",
  left: "5%",
  transform: "translateX(-50%)",
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 700,
  fontSize: "30px",
  lineHeight: "51.04px",
  color: "#5A5547",
  width: "438px",
  textAlign: "center",
});

const LoginForm = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "40%",
  transform: "translate(-50%, -50%)",
  width: "556.61px",
  textAlign: "left",
});

const Label = styled(Typography)({
  marginBottom: "3px",
  color: "#C68C35",
  fontSize: "16px",
  marginLeft: "20px",
});

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: "400px",
  height: "25px",
  marginBottom: "30px",
  "& .MuiOutlinedInput-root": {
    height: "61px",
    borderRadius: "30px",
    "& fieldset": {
      borderColor: "#6B6B6B",
    },
    "&:hover fieldset": {
      borderColor: "#6B6B6B",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6B6B6B",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#b0b0b0",
  },
}));

const SignupLink = styled(Link)({
  display: "block",
  marginBottom: "10px",
  textAlign: "left",
  marginLeft: "20px",
  color: "#C68C35",
});

const NextButton = styled(Button)({
  backgroundColor: "#5A4943",
  color: "white",
  borderRadius: "30px",
  width: "400px",
  height: "45px",
  "&:hover": {
    backgroundColor: "#3E3A3A",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
});

const ErrorModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ErrorBox = styled(Box)({
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  outline: "none",
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleError(message) {
    setError(true);
    setErrorMessage(message);
  }

  function handleClose() {
    setError(false);
    setErrorMessage("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      handleError("All fields are mandatory");
    } else {
      console.log("Login submitted:", username, password);
      let res = await login(username, password, "testorgkey");
      if (res.message === "OK") {
        localStorage.setItem("jwt", res.token);
        jwtStore.dispatch({
          type: "jwt",
          payload: res.token,
        });
        navigate("/home");
      } else {
        handleError(res.response.data.ERROR);
      }
    }
  };

  useEffect(() => {
    let jwt = localStorage.getItem("jwt");
    if (jwt) {
      jwtStore.dispatch({
        type: "jwt",
        payload: jwt,
      });
      navigate("/home");
    }
  });

  return (
    <Container>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <LeftPane />
      <RightPane>
        <WelcomeText>Welcome! Please login</WelcomeText>
        <LoginForm>
          <form onSubmit={handleSubmit}>
            <Label>Username</Label>
            <CustomTextField
              placeholder="Username"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
            />
            <Label>Password</Label>
            <CustomTextField
              placeholder="Password"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
            />
            <SignupLink href="/signup" underline="hover">
              New user? Signup here
            </SignupLink>
            <NextButton variant="contained" type="submit">
              Next <ArrowForward style={{ marginLeft: "8px" }} />
            </NextButton>
          </form>
        </LoginForm>
      </RightPane>
    </Container>
  );
};

export default Login;
