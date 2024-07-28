// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Link,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { ArrowForward } from "@mui/icons-material";
// import flowerImage from "./chinnu-indrakumar-6nRyj0rijkQ-unsplash.svg";
// import vectorImage from "./Vector.svg";
// import { signup } from "../api";
// import { useNavigate } from "react-router-dom";
// import { jwtStore } from "../redux/store";

// const Container = styled(Box)({
//   display: "flex",
//   background: `url(${vectorImage}) no-repeat center center / 100% 100%`,
//   height: "100vh",
//   width: "100vw",
//   overflow: "hidden",
//   position: "relative",
// });

// const LeftPane = styled(Box)({
//   width: "28%",
//   background: `url(${flowerImage}) no-repeat center center`,
//   backgroundSize: "cover",
// });

// const RightPane = styled(Box)({
//   width: "60%",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   position: "relative",
// });

// const WelcomeText = styled(Typography)({
//   position: "absolute",
//   top: "50px",
//   left: "20%",
//   transform: "translateX(-50%)",
//   fontFamily: "Space Grotesk, sans-serif",
//   fontWeight: 700,
//   fontSize: "30px",
//   lineHeight: "51.04px",
//   color: "#5A5547",
//   width: "438px",
//   textAlign: "center",
// });

// const LoginForm = styled(Box)({
//   position: "absolute",
//   top: "50%",
//   left: "55%",
//   transform: "translate(-50%, -50%)",
//   width: "556.61px",
//   textAlign: "left",
// });

// const Label = styled(Typography)({
//   marginBottom: "3px",
//   color: "#35C69A",
//   fontSize: "16px",
//   marginLeft: "20px",
// });
// const CustomTextField = styled(TextField)(({ theme }) => ({
//   width: "400px",
//   height: "25px",
//   marginBottom: "30px",
//   "& .MuiOutlinedInput-root": {
//     height: "61px",
//     borderRadius: "30px",
//     "& fieldset": {
//       borderColor: "#6B6B6B",
//     },
//     "&:hover fieldset": {
//       borderColor: "#6B6B6B",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#6B6B6B",
//     },
//   },
//   "& .MuiInputBase-input": {
//     padding: "12px 14px",
//   },
//   "& .MuiInputBase-input::placeholder": {
//     color: "#b0b0b0",
//   },
// }));

// const SignupLink = styled(Link)({
//   display: "block",
//   marginBottom: "10px",
//   textAlign: "left",
//   marginLeft: "20px",
//   color: "#35C69A",
// });

// const NextButton = styled(Button)({
//   backgroundColor: "#35C69A",
//   color: "white",
//   borderRadius: "30px",
//   width: "400px",
//   height: "45px",
//   "&:hover": {
//     backgroundColor: "#2BA37F",
//   },
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "0 16px",
// });

// const App = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [cPassword, setCPassword] = useState("");
//   const [orgKey, setOrgKey] = useState("");
//   const [error, setError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   function handleError(message) {
//     setError(true);
//     setErrorMessage(message);
//   }

//   function handleClose() {
//     setError(false);
//     setErrorMessage("");
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       username === "" ||
//       password === "" ||
//       cPassword === "" ||
//       orgKey === ""
//     ) {
//       handleError("All fields are mandatory");
//     } else {
//       let res = await signup(username, password, cPassword, orgKey);
//       if (res.message == "OK") {
//         localStorage.setItem("jwt", res.token);
//         localStorage.setItem("collapse", true);
//         jwtStore.dispatch({
//           type: "jwt",
//           payload: res.token,
//         });
//         navigate("/home");
//       } else {
//         handleError(res.response.data.ERROR);
//       }
//     }
//   };

//   useEffect(() => {
//     let jwt = localStorage.getItem("jwt");
//     if (jwt) {
//       jwtStore.dispatch({
//         type: "jwt",
//         payload: jwt,
//       });
//       navigate("/home");
//     }
//   });

//   return (
//     <Container>
//       <Snackbar
//         open={error}
//         autoHideDuration={5000}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert onClose={handleClose} severity="error">
//           {errorMessage}
//         </Alert>
//       </Snackbar>
//       <LeftPane />
//       <RightPane>
//         <WelcomeText>Welcome! Please SignUp</WelcomeText>
//         <LoginForm>
//           <form onSubmit={handleSubmit}>
//             <Label>Username</Label>
//             <CustomTextField
//               placeholder="Username"
//               variant="outlined"
//               fullWidth
//               onChange={(e) => {
//                 setUsername(e.target.value);
//               }}
//               type="text"
//               className="custom-placeholder"
//               inputProps={{ style: { textIndent: "6px" } }}
//             />
//             <Label>Password</Label>
//             <CustomTextField
//               placeholder="Password"
//               variant="outlined"
//               fullWidth
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//               type="password"
//               className="custom-placeholder"
//               inputProps={{ style: { textIndent: "6px" } }}
//             />
//             <Label>Confirm Password</Label>
//             <CustomTextField
//               placeholder="Password"
//               variant="outlined"
//               fullWidth
//               onChange={(e) => {
//                 setCPassword(e.target.value);
//               }}
//               type="password"
//               className="custom-placeholder"
//               inputProps={{ style: { textIndent: "6px" } }}
//             />
//             <Label>Access Key</Label>
//             <CustomTextField
//               placeholder="Access Key"
//               variant="outlined"
//               fullWidth
//               onChange={(e) => {
//                 setOrgKey(e.target.value);
//               }}
//               type="key"
//               className="custom-placeholder"
//               inputProps={{ style: { textIndent: "6px" } }}
//             />
//             <SignupLink href="/" underline="hover">
//               Already Registered? Login here
//             </SignupLink>
//             <NextButton variant="contained" type="submit">
//               Next <ArrowForward style={{ marginLeft: "8px" }} />
//             </NextButton>
//           </form>
//         </LoginForm>
//       </RightPane>
//     </Container>
//   );
// };

// export default App;


import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
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

const SignupContent = styled(Box)({
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
  fontFamily: "Montserrat",
  fontWeight: 600,
  fontSize: "60px",
  lineHeight: "51.04px",
  color: "#5A5547",
  width: "100%",
  textAlign: "center",
});

const SignupForm = styled(Box)({
  width: "400px",
  padding: "30px",
  borderRadius: "2rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  marginTop: "80px",
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
    color: "#000",
  },
  "& .MuiInputLabel-root": {
    color: "#6d7199",
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [orgKey, setOrgKey] = useState("");
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
    if (username === "" || password === "" || cPassword === "" || orgKey === "") {
      handleError("All fields are mandatory");
    } else {
      setIsAuthenticating(true);
      try {
        let res = await signup(username, password, cPassword, orgKey);
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
        handleError("An error occurred during signup");
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
    <SignupContent>
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
        <WelcomeText>Welcome! Please SignUp</WelcomeText>
        <SignupForm>
          <Typography style={{
            fontFamily: "Hind",
          }} variant="h4" color="#000" marginBottom={"15px"} gutterBottom>
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <CustomTextField
              label="Username"
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
            <CustomTextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <CustomTextField
              label="Access Key"
              variant="outlined"
              fullWidth
              value={orgKey}
              onChange={(e) => setOrgKey(e.target.value)}
            />
            <button className="login-button">
              <span>Sign Up</span>
            </button>
          </form>
          <Link href="/" color="#6d7199" underline="hover" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            Already Registered? Login here
          </Link>
        </SignupForm>
      </RightPane>
      {isAuthenticating && (
        <AuthOverlay>
          <AuthIcon />
          <AuthText variant="h6">Signing Up...</AuthText>
        </AuthOverlay>
      )}
    </SignupContent>
  );
};

export default Signup;