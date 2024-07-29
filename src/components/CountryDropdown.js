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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import * as CountryData from "./countries";
import { gridStore } from "../redux/store";

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

  const handleRegionSelect = (region, countries) => {
    gridStore.dispatch({
      type: "grid",
      payload: {
        options: gridStore.getState().options,
        columns: [region],
      },
    });
    setSelectedRegions([...selectedRegions, region]);
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

  const toggleRegion = (region) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  return (
    <Select
      multiple
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedCountries}
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
      {formatCountryData().flatMap(({ region, countries }) => [
        <ListItemButton
          key={`${region}-button`}
          onClick={() => toggleRegion(region)}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={isRegionSelected(countries)}
              indeterminate={
                selectedCountries.some((country) =>
                  countries.includes(country)
                ) && !isRegionSelected(countries)
              }
              onClick={(event) => {
                event.stopPropagation();
                handleRegionSelect(region, countries);
              }}
            />
          </ListItemIcon>
          <ListItemText primary={region} />
          {expandedRegions[region] ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>,
        <Collapse
          key={`${region}-collapse`}
          in={expandedRegions[region]}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {countries.map((country) => (
              <ListItemButton
                key={country}
                sx={{ pl: 4 }}
                onClick={(event) => handleCountrySelect(event, country)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedCountries.includes(country)}
                  />
                </ListItemIcon>
                <ListItemText primary={country} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>,
      ])}
    </Select>
  );
};

export default CountryDropdown;
