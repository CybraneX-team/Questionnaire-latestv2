import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  ListSubheader,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import * as CountryData from "./countries";

const formatCountryData = () => {
  return Object.entries(CountryData).map(([region, countries]) => ({
    region,
    countries,
  }));
};

const CountryDropdown = ({
  selectedCountries,
  setSelectedCountries,
  placeholder,
  selectedRegions,
  setSelectedRegions,
}) => {
  const [open, setOpen] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState({});

  const handleCountrySelect = (event, country) => {
    event.stopPropagation();
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  // const handleRegionSelect = (region, countries) => {
  //   setSelectedRegions([...selectedRegions, region]);
  //   setSelectedCountries((prev) => {
  //     const isRegionFullySelected = countries.every((country) =>
  //       prev.includes(country)
  //     );
  //     if (isRegionFullySelected) {
  //       return prev.filter((country) => !countries.includes(country));
  //     } else {
  //       return [...new Set([...prev, ...countries])];
  //     }
  //   });
  // };

  const handleRegionSelect = (event, region, countries) => {
    event.stopPropagation();
    setSelectedRegions((prev) => {
      if (prev.includes(region)) {
        return prev.filter((r) => r !== region);
      } else {
        return [...prev, region];
      }
    });
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

  const toggleRegion = (event, region) => {
    event.stopPropagation();
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  return (
    <Select
      multiple
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedCountries}
      onChange={() => { }}
      displayEmpty
      renderValue={(selected) => {
        if (selected.length === 0) {
          return <em>{placeholder}</em>;
        }
        const maxDisplay = 7;
        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 0.5,
              overflow: "hidden",
            }}
          >
            {selected.slice(0, maxDisplay).map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
            {selected.length > maxDisplay && (
              <Typography variant="body2" sx={{ alignSelf: "center" }}>
                +{selected.length - maxDisplay} more
              </Typography>
            )}
          </Box>
        );
      }}
      sx={{ width: "100%", marginBottom: 2 }}
    >
      {/* {formatCountryData().map(({ region, countries }) => [
        <ListSubheader key={region}>
          <MenuItem
            onClick={(event) => {
              event.preventDefault();
              handleRegionSelect(region, countries);
            }}
          >
            <Checkbox
              checked={isRegionSelected(countries)}
              indeterminate={
                selectedCountries.some((country) =>
                  countries.includes(country)
                ) && !isRegionSelected(countries)
              }
            />
            {region}
          </MenuItem>
        </ListSubheader>,
        ...countries.map((country) => (
          <MenuItem key={country} value={country}>
            <Checkbox checked={selectedCountries.includes(country)} />
            {country}
          </MenuItem>
        )),
      ])} */}

      {formatCountryData().map(({ region, countries }) => [
        <ListSubheader key={region}>
          <MenuItem
            onClick={(event) => handleRegionSelect(event, region, countries)}
          >
            <Checkbox
              checked={isRegionSelected(countries)}
              indeterminate={
                selectedCountries.some((country) =>
                  countries.includes(country)
                ) && !isRegionSelected(countries)
              }
            />
            {region}
            <IconButton
              onClick={(event) => toggleRegion(event, region)}
              size="small"
            >
              {expandedRegions[region] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </MenuItem>
        </ListSubheader>,
        <Collapse in={expandedRegions[region]} key={`collapse-${region}`}>
          {countries.map((country) => (
            <MenuItem
              key={country}
              value={country}
              style={{ paddingLeft: 32 }}
              onClick={(event) => handleCountrySelect(event, country)}
            >
              <Checkbox checked={selectedCountries.includes(country)} />
              {country}
            </MenuItem>
          ))}
        </Collapse>
      ])}
    </Select>
  );
};

export default CountryDropdown;
