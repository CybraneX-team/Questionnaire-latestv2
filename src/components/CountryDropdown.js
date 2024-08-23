import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Chip,
  Box,
  ListSubheader,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import * as CountryData from "./countries";

const formatCountryData = () => {
  return Object.entries(CountryData).map(([region, countries]) => ({
    region,
    countries: countries.map(country => ({ name: country, region })),
  }));
};

const CountryDropdown = () => {
  const [selectionType, setSelectionType] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);

  const handleTypeChange = (event) => {
    setSelectionType(event.target.value);
    setSelectedItems([]);
    setOpen(true);
  };

  const handleItemSelect = (event) => {
    setSelectedItems(event.target.value);
  };

  const handleBackToSelection = () => {
    setSelectionType("");
    setSelectedItems([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const renderDropdown = () => {
    if (selectionType === "") {
      return (
        <Select
          value={selectionType}
          onChange={handleTypeChange}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          displayEmpty
          sx={{ width: "100%", marginBottom: 2 }}
        >
          <MenuItem value="" disabled>
            Choose selection type
          </MenuItem>
          <MenuItem value="countries">Countries</MenuItem>
          <MenuItem value="regions">Regions</MenuItem>
        </Select>
      );
    }
    const formattedData = formatCountryData();
    const items = selectionType === "countries"
      ? formatCountryData().flatMap(({ countries }) => countries)
      : formatCountryData();

    return (
      <Select
        multiple
        value={selectedItems}
        onChange={handleItemSelect}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>{selectionType === "countries" ? "Select countries" : "Select regions"}</em>;
          }
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          );
        }}
        sx={{ width: "100%", marginBottom: 2 }}
      >
         <ListSubheader>
          <MenuItem onClick={handleBackToSelection} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to selection type
          </MenuItem>
        </ListSubheader>
        {selectionType === "regions" ? (
          items.map(({ region, countries }) => (
            <MenuItem key={region} value={region}>
              <Box display="flex" alignItems="center" width="100%">
                <span>{region}</span>
                <Box flexGrow={1} />
                <Tooltip title={countries.map(c => c.name).join(", ")} arrow>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
          ))
        ) : (
          items.map(({ name, region }) => (
            <MenuItem key={name} value={name}>
              <Box display="flex" alignItems="center" width="100%">
                <span>{name}</span>
                <Box flexGrow={1} />
                <Tooltip title={`Region: ${region}`} arrow>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    );
  };

  return renderDropdown();
};

export default CountryDropdown;