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
import {
  answerStore,
  gridStore,
  mapStore,
  qTitleStore,
  solnStore,
} from "../redux/store";
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
    maxWidth: "100%",
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
  const [regions, setRegions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectionMode, setSelectionMode] = useState("regions");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const formatCountryData = () => {
    return Object.entries(CountryData).map(([region, countries]) => ({
      region,
      countries,
    }));
  };

  useEffect(() => {
    if (showMap) {
      mapStore.dispatch({
        type: "UPDATE",
        payload: {
          id: qTitleStore.getState(),
          data: answerStore.getState(),
        },
      });
    }
  }, [showMap, selectedOption]);

  const handleOptionChange = (item, selected) => {
    if (selectionMode === "countries") {
      let region = "";
      if (CountryData.NAC.includes(item.name)) {
        region = "NAC";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { NAC: selected },
          },
        });
      } else if (CountryData.WNS.includes(item.name)) {
        region = "WNS";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { WNS: selected },
          },
        });
      } else if (CountryData.Oceania.includes(item.name)) {
        region = "Oceania";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { Oceania: selected },
          },
        });
      } else if (CountryData.SSA.includes(item.name)) {
        region = "SSA";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { SSA: selected },
          },
        });
      } else if (CountryData.LAC.includes(item.name)) {
        region = "LAC";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { LAC: selected },
          },
        });
      } else if (CountryData.SA.includes(item.name)) {
        region = "SA";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { SA: selected },
          },
        });
      } else if (CountryData.ESE.includes(item.name)) {
        region = "ESE";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { ESE: selected },
          },
        });
      } else if (CountryData.MENA.includes(item.name)) {
        region = "MENA";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { MENA: selected },
          },
        });
      } else if (CountryData.EEC.includes(item.name)) {
        region = "EEC";
        answerStore.dispatch({
          type: "answer_object",
          payload: {
            ...answerStore.getState(),
            [item.name]: { EEC: selected },
          },
        });
      }
      setSelectedOption({
        ...selectedOption,
        [item.name]: selected,
      });
      answerStore.dispatch({
        type: "answer_object",
        payload: {
          ...answerStore.getState(),
          [item.name]: { [region]: selected },
        },
      });
    } else {
      setSelectedOption({ ...selectedOption, [item.name]: selected });
    }
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

  useEffect(() => {
    console.log(selectedRegions);
    for (let i = 0; i < selectedRegions.length; i++) {
      setSelectedOption({
        ...selectedOption,
        [selectedRegions[i]]: "Insignificant",
      });
      answerStore.dispatch({
        type: "answer_object",
        payload: { ...selectedOption, [selectedRegions[i]]: "Insignificant" },
      });
    }
  }, [selectedRegions]);

  useEffect(() => {
    setSelectedOption({});
    const unsubscribe = gridStore.subscribe(() => {
      const state = gridStore.getState();
      setTitle(state.itemTitle);
      setOptions(state.options);
      setColumns(state.columns);
      setRegions(state.columns);
    });
    return () => unsubscribe();
  }, [options]);

  useEffect(() => {
    const unsubscribe = qTitleStore.subscribe(() => {
      const currentQuestion = qTitleStore.getState();
      setShowMap(mapQuestions.includes(currentQuestion));
      setSelectedCountries([]);
      setSelectedRegions([]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectionMode === "countries") {
      setColumns([]);
    } else if (selectionMode === "regions") {
      setColumns(regions);
    }

    if (selectedPlaces) {
      setColumns(selectedPlaces);
    }
  }, [selectionMode, selectedPlaces]);

  return (
    <Box sx={formStyles.container}>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontFamily: "montserrat",
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
      <Paper style={{ ...formStyles.paper, fontFamily: "montserrat" }}>
        {showMap && (
          <CountryDropdown
            // selectedCountries={selectedCountries}
            // setSelectedCountries={setSelectedCountries}
            // placeholder="Select Countries"
            // selectedRegions={selectedRegions}
            // setSelectedRegions={setSelectedRegions}
            setSelectionMode={setSelectionMode}
            setSelectedPlaces={setSelectedPlaces}
          />
        )}
        <Box sx={{ overflowX: "auto" }}>
          <Table
            style={{
              fontFamily: "montserrat",
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
                    fontFamily: "montserrat",
                    color: "#444444",
                    fontSize: "13px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    padding: "15px",
                    // wordWrap: "break-word",
                  }}
                ></TableCell>
                {options.map((option, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    style={{
                      fontFamily: "montserrat",
                      color: "#444444",
                      fontSize: "13px",
                      lineHeight: "18px",
                      border: "1px solid #ccc",
                      textAlign: "center",
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
                      fontFamily: "montserrat",
                      borderBottom: "1px solid #ccc",
                      color: "#444444",
                      fontSize: "14px",
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
                        fontFamily: "montserrat",
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
      {showMap && <ChoroplethMap />}
    </Box>
  );
};

export default GridQuestion;
