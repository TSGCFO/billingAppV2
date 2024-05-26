import React, { useState, useEffect, Fragment } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogTitle, List, ListItem } from '@mui/material';
import axios from 'axios';

function CreatePricingForm({ handleClose }) {
  const [pricingData, setPricingData] = useState({
    customer: '',
    generalPricing: {},
    additionalOptions: []
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [options, setOptions] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  useEffect(() => {
    if (pricingData.customer) {
      axios.get('http://localhost:5000/api/pricing-options?customerId=' + pricingData.customer)
        .then(response => {
          console.log('Fetched pricing options:', response.data);
          setOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching pricing options:', error);
        });
    }
  }, [pricingData.customer]);

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
          <MenuItem value="">Select a customer</MenuItem>
          {customers.map(customer => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.id} {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <Button onClick={handleClose}>Cancel</Button>
    </Box>
  );
}

export default CreatePricingForm;
