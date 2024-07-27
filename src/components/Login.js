import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Link, Snackbar, Alert } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { jwtStore } from "../redux/store";
import vectorImage from "./Vector.svg";
import "./login-form.css";
import flowerImage from "./chinnu-indrakumar-6nRyj0rijkQ-unsplash.svg";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoginContent = styled(Box)({
  width: "100vw",
  height: "100vh",
  display: "flex",
  background: `url(${vectorImage}) no-repeat center center / 100% 100%`,
  position: "relative",
  overflow: "hidden",
});

const WelcomeText = styled(Typography)({
  position: "absolute",
  top: "60px",
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 600,
  fontSize: "60px",
  lineHeight: "51.04px",
  color: "#5A5547",
  width: "100%",
  textAlign: "center",
});

const LoginForm = styled(Box)({
  width: "400px",
  padding: "30px",
  // backgroundColor: "#cffaf2",
  borderRadius: "2rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
});

const LeftPane = styled(Box)({
  width: "28%",
  background: `url(${flowerImage}) no-repeat center center`,
  backgroundSize: "cover",
  zIndex: 999,
});

const RightPane = styled(Box)({
  width: "60%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

const CustomTextField = styled(TextField)({
  marginBottom: "20px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#6d7199",
    },
    "&:hover fieldset": {
      borderColor: "#8b92c5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#35C69A",
    },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "#6d7199",
  },
});

const LoginButton = styled(Button)({
  backgroundColor: "#35C69A",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#2ba37f",
  },
});

const AuthOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  bottom: 0,
  backgroundColor: "rgba(47, 50, 65, 0.9)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  animation: `${slideIn} 0.5s ease-out`,
});

const AuthIcon = styled(Box)({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "3px solid #35C69A",
  borderTopColor: "transparent",
  animation: `${rotate} 1s linear infinite`,
});

const AuthText = styled(Typography)({
  color: "#fff",
  marginTop: "20px",
  animation: `${fadeIn} 0.5s ease-out 0.5s both`,
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleError = (message) => {
    setError(true);
    setErrorMessage(message);
  };

  const handleClose = () => {
    setError(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      handleError("All fields are mandatory");
    } else {
      setIsAuthenticating(true);
      try {
        let res = await login(username, password, "testorgkey");
        if (res.message === "OK") {
          localStorage.setItem("jwt", res.token);
          localStorage.setItem("collapse", true);
          jwtStore.dispatch({
            type: "jwt",
            payload: res.token,
          });
          setTimeout(() => {
            setIsAuthenticating(false);
            navigate("/home");
          }, 2000);
        } else {
          setIsAuthenticating(false);
          handleError(res.response.data.ERROR);
        }
      } catch (error) {
        setIsAuthenticating(false);
        handleError("An error occurred during authentication");
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
  }, [navigate]);

  return (
    <LoginContent>
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
        <WelcomeText>Welcome back!</WelcomeText>
        <LoginForm>
          <Typography variant="h5" color="#000" marginBottom={"30px"} gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <CustomTextField
              label="Email"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <CustomTextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <LoginButton type="submit" variant="contained" fullWidth>
              Log In
            </LoginButton> */}
            <button className="login-button">
              <span>Login</span>
            </button>
          </form>
          <Link href="/signup" color="#6d7199" underline="hover" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            New user? Signup here
          </Link>
        </LoginForm>
      </RightPane>
      {isAuthenticating && (
        <AuthOverlay>
          <AuthIcon />
          <AuthText variant="h6">AUTHENTICATING...</AuthText>
        </AuthOverlay>
      )}
    </LoginContent>
  );
};

export default Login;