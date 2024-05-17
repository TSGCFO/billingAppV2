import React, { useState, useEffect, Fragment } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogTitle, List, ListItem } from '@mui/material';

function CreatePricingForm({ fetchPricingOptions }) {
  const [pricingData, setPricingData] = useState({
    customer: '',
    generalPricing: {}, // Standard pricing fields
    additionalOptions: []
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [options, setOptions] = useState([]); // Dynamic options based on customer

  useEffect(() => {
    if (pricingData.customer) {
      fetchPricingOptions(pricingData.customer).then(setOptions); // Fetch and set options when customer changes
    }
  }, [pricingData.customer, fetchPricingOptions]);

  const handleInputChange = (event) => {
    setPricingData({ ...pricingData, [event.target.name]: event.target.value });
  };

  const handleAddOption = (option) => {
    if (!pricingData.additionalOptions.some(o => o.key === option.key)) {
      setPricingData({
        ...pricingData,
        additionalOptions: [...pricingData.additionalOptions, { ...option, value: '' }]
      });
    }
    setOpenPopup(false);
  };

  const handleOptionValueChange = (key, value) => {
    const newOptions = pricingData.additionalOptions.map(o => o.key === key ? { ...o, value } : o);
    setPricingData({ ...pricingData, additionalOptions: newOptions });
  };

  const handleRemoveOption = (key) => {
    const newOptions = pricingData.additionalOptions.filter(o => o.key !== key);
    setPricingData({ ...pricingData, additionalOptions: newOptions });
  };

  const handleSubmit = () => {
    console.log(pricingData);
    // Submit logic here
  };

  const handleReset = () => {
    setPricingData({ customer: '', generalPricing: {}, additionalOptions: [] });
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="customer-select-label">Customer</InputLabel>
        <Select
          labelId="customer-select-label"
          id="customer-select"
          value={pricingData.customer}
          label="Customer"
          onChange={handleInputChange}
          name="customer"
        >
          <MenuItem value={10}>Customer 1</MenuItem>
          <MenuItem value={20}>Customer 2</MenuItem>
        </Select>
      </FormControl>
      {/* Map over general and additional fields here */}
      <Button onClick={() => setOpenPopup(true)}>Add More Pricing Options</Button>
      {pricingData.additionalOptions.map((option) => (
        <Fragment key={option.key}>
          <TextField
            fullWidth
            margin="normal"
            label={option.label}
            value={option.value}
            onChange={(e) => handleOptionValueChange(option.key, e.target.value)}
            name={option.key}
          />
          <Button onClick={() => handleRemoveOption(option.key)}>Remove</Button>
        </Fragment>
      ))}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Select Pricing Options</DialogTitle>
        <List>
          {options.map(option => (
            <ListItem key={option.key} button onClick={() => handleAddOption(option)}>
              {option.label}
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Button type="submit">Save</Button>
      <Button onClick={handleReset}>Save and New</Button>
    </Box>
  );
}

export default CreatePricingForm;
