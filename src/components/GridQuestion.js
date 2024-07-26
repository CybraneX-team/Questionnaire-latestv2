// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Radio,
//   FormControlLabel,
//   Typography,
//   Paper,
//   Box,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import { answerStore, gridStore, solnStore } from "../redux/store";
// import { Chart } from "react-chartjs-2";
// import { Chart as ChartJS, registerables } from "chart.js";
// import {
//   GeoFeature,
//   ChoroplethController,
//   ColorScale,
//   ProjectionScale,
// } from "chartjs-chart-geo";
// import ChoroplethMap from "./choropleth";

// const formStyles = {
//   container: {
//     marginTop: "-40px",
//     padding: "20px",
//     backgroundColor: "white",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   paper: {
//     padding: "20px",
//     borderRadius: "15px",
//     overflow: "hidden",
//     backgroundColor: "#E5FFFC",
//     flexGrow: 1,
//     width: "100%",
//     maxWidth: "90%",
//     margin: "0 auto",
//   },
// };

// const CustomRadio = (props) => (
//   <Radio
//     {...props}
//     icon={<RadioButtonUncheckedIcon />}
//     checkedIcon={<CheckCircleIcon sx={{ color: "#2B675C" }} />}
//   />
// );

// const GridQuestion = () => {
//   const [selectedOption, setSelectedOption] = useState({});
//   const [title, setTitle] = useState("");
//   const [options, setOptions] = useState([]);
//   const [columns, setColumns] = useState([]);

//   ChartJS.register(
//     ...registerables,
//     GeoFeature,
//     ChoroplethController,
//     ProjectionScale,
//     ColorScale
//   );

//   const handleOptionChange = (item, selected) => {
//     setSelectedOption({ ...selectedOption, [item.name]: selected });
//     answerStore.dispatch({
//       type: "answer_object",
//       payload: { ...selectedOption, [item.name]: selected },
//     });
//     console.log(item.name);
//   };

//   const getCellBackgroundColor = (item, option) => {
//     return selectedOption[item.name] === option ? "#B1FFE8" : "white";
//   };

//   solnStore.subscribe(() => {
//     let state = solnStore.getState();
//     setSelectedOption({ ...selectedOption, ...state });
//     console.log(selectedOption);
//   });

//   useEffect(() => {
//     setSelectedOption({});
//     const unsubscribe = gridStore.subscribe(() => {
//       const state = gridStore.getState();
//       setTitle(state.itemTitle);
//       setOptions(state.options);
//       setColumns(state.columns);
//     });
//     return () => unsubscribe();
//   }, [options]);

//   return (
//     <Box sx={formStyles.container}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         style={{
//           fontFamily: "",
//           fontWeight: 500,
//           fontSize: "24px",
//           lineHeight: "28px",
//           textAlign: "center",
//           marginBottom: "20px",
//           color: "#A4A1A0",
//         }}
//       >
//         {title}
//       </Typography>
//       <Paper style={{ ...formStyles.paper, fontFamily: "" }}>
//         <Box sx={{ overflowX: "auto" }}>
//           <Table
//             style={{
//               fontFamily: "",
//               borderCollapse: "collapse",
//               width: "100%",
//               tableLayout: "fixed",
//               borderRadius: "10px",
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell
//                   style={{
//                     fontFamily: "",
//                     color: "#444444",
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     border: "1px solid #ccc",
//                     textAlign: "center",
//                     padding: "15px",
//                     wordWrap: "break-word",
//                   }}
//                 ></TableCell>
//                 {options.map((option, i) => (
//                   <TableCell
//                     key={i}
//                     align="center"
//                     style={{
//                       fontFamily: "",
//                       color: "#444444",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       border: "1px solid #ccc",
//                       textAlign: "center",
//                       padding: "15px",
//                       wordWrap: "break-word",
//                     }}
//                   >
//                     {option}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {columns.map((column, index) => (
//                 <TableRow key={index}>
//                   <TableCell
//                     style={{
//                       fontFamily: "",
//                       borderBottom: "1px solid #ccc",
//                       color: "#444444",
//                       fontWeight: "bold",
//                       fontSize: "12px",
//                       borderRight: "1px solid #ccc",
//                       borderLeft: "1px solid #ccc",
//                       textAlign: "center",
//                       padding: "10px",
//                       wordWrap: "break-word",
//                     }}
//                   >
//                     {column}
//                   </TableCell>
//                   {options.map((option, i) => (
//                     <TableCell
//                       key={`${column}-${i}`}
//                       align="center"
//                       style={{
//                         fontFamily: "",
//                         borderBottom: "1px solid #ccc",
//                         color: "#444444",
//                         fontWeight: "bold",
//                         fontSize: "12px",
//                         borderRight: "1px solid #ccc",
//                         borderLeft: "1px solid #ccc",
//                         textAlign: "center",
//                         padding: "10px",
//                         wordWrap: "break-word",
//                         backgroundColor: getCellBackgroundColor(
//                           { name: column },
//                           option
//                         ),
//                       }}
//                     >
//                       <FormControlLabel
//                         control={
//                           <CustomRadio
//                             style={{
//                               display: "block",
//                               margin: "auto",
//                               marginRight: "20px",
//                             }}
//                             checked={selectedOption[column] === option}
//                             onChange={() =>
//                               handleOptionChange({ name: column }, option)
//                             }
//                             value={option}
//                             name={column}
//                           />
//                         }
//                         label=""
//                         labelPlacement="start"
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//       </Paper>
//       <ChoroplethMap />
//     </Box>
//   );
// };

// export default GridQuestion;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Radio,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListSubheader,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { answerStore, gridStore, qTitleStore, solnStore } from "../redux/store";
import ChoroplethMap from "./choropleth";
import * as CountryData from "./countries"; // Adjust the import path as needed
import CountryDropdown from "./CountryDropdown";
import { mapQuestions } from "../utils/utils";

const formStyles = {
  container: {
    marginTop: "-40px",
    padding: "20px",
    backgroundColor: "white",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: "20px",
    borderRadius: "15px",
    overflow: "hidden",
    backgroundColor: "#E5FFFC",
    flexGrow: 1,
    width: "100%",
    maxWidth: "90%",
    margin: "0 auto",
  },
};

const CustomRadio = (props) => (
  <Radio
    {...props}
    icon={<RadioButtonUncheckedIcon />}
    checkedIcon={<CheckCircleIcon sx={{ color: "#2B675C" }} />}
  />
);

const GridQuestion = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const formatCountryData = () => {
    return Object.entries(CountryData).map(([region, countries]) => ({
      region,
      countries,
    }));
  };

  const handleOptionChange = (item, selected) => {
    setSelectedOption({ ...selectedOption, [item.name]: selected });
    answerStore.dispatch({
      type: "answer_object",
      payload: { ...selectedOption, [item.name]: selected },
    });
  };

  const getCellBackgroundColor = (item, option) => {
    return selectedOption[item.name] === option ? "#B1FFE8" : "white";
  };

  const handleCountrySelect = (event) => {
    const value = event.target.value;
    setSelectedCountries(typeof value === "string" ? value.split(",") : value);
  };

  const handleRegionSelect = (region, countries) => {
    setSelectedCountries((prev) => {
      const isRegionFullySelected = countries.every((country) =>
        prev.includes(country)
      );
      if (isRegionFullySelected) {
        return prev.filter((country) => !countries.includes(country));
      } else {
        return [...new Set([...prev, ...countries])];
      }
    });
  };

  const isRegionSelected = (countries) => {
    return countries.every((country) => selectedCountries.includes(country));
  };

  // const CountryDropdown = () => (
  //   <Select
  //     multiple
  //     value={selectedCountries}
  //     onChange={handleCountrySelect}
  //     renderValue={(selected) => (
  //       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
  //         {selected.map((value) => (
  //           <Chip key={value} label={value} />
  //         ))}
  //       </Box>
  //     )}
  //     sx={{ width: '100%', marginBottom: 2 }}
  //   >
  //     {formatCountryData().map(({ region, countries }) => [
  //       <ListSubheader key={region}>
  //         <MenuItem>
  //           <Checkbox
  //             checked={isRegionSelected(countries)}
  //             indeterminate={
  //               selectedCountries.some(country => countries.includes(country)) &&
  //               !isRegionSelected(countries)
  //             }
  //             onChange={() => handleRegionSelect(region, countries)}
  //           />
  //           {region}
  //         </MenuItem>
  //       </ListSubheader>,
  //       ...countries.map((country) => (
  //         <MenuItem key={country} value={country}>
  //           <Checkbox checked={selectedCountries.includes(country)} />
  //           {country}
  //         </MenuItem>
  //       ))
  //     ])}
  //   </Select>
  // );

  useEffect(() => {
    setSelectedOption({});
    const unsubscribe = gridStore.subscribe(() => {
      const state = gridStore.getState();
      setTitle(state.itemTitle);
      setOptions(state.options);
      setColumns(state.columns);
    });
    return () => unsubscribe();
  }, [options]);

  useEffect(() => {
    solnStore.subscribe(() => {
      let state = solnStore.getState();
      setSelectedOption({ ...selectedOption, ...state });
    });

    const unsubscribe = qTitleStore.subscribe(() => {
      if (mapQuestions.includes(qTitleStore.getState())) {
        setShowMap(true);
      }
    });
  });

  return (
    <Box sx={formStyles.container}>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontFamily: "",
          fontWeight: 500,
          fontSize: "24px",
          lineHeight: "28px",
          textAlign: "center",
          marginBottom: "20px",
          color: "#A4A1A0",
        }}
      >
        {title}
      </Typography>
      <Paper style={{ ...formStyles.paper, fontFamily: "" }}>
        <CountryDropdown
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          placeholder="Select Countries"
        />
        <Box sx={{ overflowX: "auto" }}>
          <Table
            style={{
              fontFamily: "",
              borderCollapse: "collapse",
              width: "100%",
              tableLayout: "fixed",
              borderRadius: "10px",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontFamily: "",
                    color: "#444444",
                    fontSize: "12px",
                    fontWeight: "bold",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    padding: "15px",
                    wordWrap: "break-word",
                  }}
                ></TableCell>
                {options.map((option, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    style={{
                      fontFamily: "",
                      color: "#444444",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      padding: "15px",
                      wordWrap: "break-word",
                    }}
                  >
                    {option}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {columns.map((column, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{
                      fontFamily: "",
                      borderBottom: "1px solid #ccc",
                      color: "#444444",
                      fontWeight: "bold",
                      fontSize: "12px",
                      borderRight: "1px solid #ccc",
                      borderLeft: "1px solid #ccc",
                      textAlign: "center",
                      padding: "10px",
                      wordWrap: "break-word",
                    }}
                  >
                    {column}
                  </TableCell>
                  {options.map((option, i) => (
                    <TableCell
                      key={`${column}-${i}`}
                      align="center"
                      style={{
                        fontFamily: "",
                        borderBottom: "1px solid #ccc",
                        color: "#444444",
                        fontWeight: "bold",
                        fontSize: "12px",
                        borderRight: "1px solid #ccc",
                        borderLeft: "1px solid #ccc",
                        textAlign: "center",
                        padding: "10px",
                        wordWrap: "break-word",
                        backgroundColor: getCellBackgroundColor(
                          { name: column },
                          option
                        ),
                      }}
                    >
                      <FormControlLabel
                        control={
                          <CustomRadio
                            style={{
                              display: "block",
                              margin: "auto",
                              marginRight: "20px",
                            }}
                            checked={selectedOption[column] === option}
                            onChange={() =>
                              handleOptionChange({ name: column }, option)
                            }
                            value={option}
                            name={column}
                          />
                        }
                        label=""
                        labelPlacement="start"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      {showMap ? <ChoroplethMap /> : <></>}
    </Box>
  );
};

export default GridQuestion;
