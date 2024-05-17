import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const customerSchema = Yup.object().shape({
  customerId: Yup.number().required('Customer ID is required'),
  companyName: Yup.string().required('Company name is required'),
  legalBusinessName: Yup.string().required('Legal business name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip code is required'),
  country: Yup.string().required('Country is required'),
  accountsPayable: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
    })
  ),
  businessType: Yup.string().required('Business type is required')
});

const CustomerModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Customer</DialogTitle>
      <Formik
        initialValues={{
          customerId: '', // Add initial value for customerId
          companyName: '',
          legalBusinessName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          accountsPayable: [{ name: '', email: '', phone: '' }],
          businessType: ''
        }}
        validationSchema={customerSchema}
        onSubmit={(values, { setSubmitting }) => {
          axios.post('http://localhost:5000/customers', values)
            .then(response => {
              console.log(response.data);
              setSubmitting(false);
              handleClose();
            })
            .catch(error => {
              console.error('There was an error!', error);
              setSubmitting(false);
            });
        }}
      >
        {formikProps => (
          <Form>
            <DialogContent>
              <Field as={TextField} name="customerId" label="Customer ID" fullWidth />
              <Field as={TextField} name="companyName" label="Company Name" fullWidth />
              <Field as={TextField} name="legalBusinessName" label="Legal Business Name" fullWidth />
              <Field as={TextField} name="email" label="Email" fullWidth />
              <Field as={TextField} name="phone" label="Phone" fullWidth />
              <Field as={TextField} name="address" label="Address" fullWidth />
              <Field as={TextField} name="city" label="City" fullWidth />
              <Field as={TextField} name="state" label="State" fullWidth />
              <Field as={TextField} name="zip" label="Zip" fullWidth />
              <Field as={TextField} name="country" label="Country" fullWidth />
              <FieldArray name="accountsPayable">
                {({ push, remove }) => (
                  formikProps.values.accountsPayable.map((account, index) => (
                    <div key={index}>
                      <Field as={TextField} name={`accountsPayable.${index}.name`} label="Name" fullWidth />
                      <Field as={TextField} name={`accountsPayable.${index}.email`} label="Email" fullWidth />
                      <Field as={TextField} name={`accountsPayable.${index}.phone`} label="Phone" fullWidth />
                      <Button type="button" onClick={() => remove(index)}>Remove</Button>
                      {index === formikProps.values.accountsPayable.length - 1 && (
                        <Button type="button" onClick={() => push({ name: '', email: '', phone: '' })}>Add More</Button>
                      )}
                    </div>
                  ))
                )}
              </FieldArray>
              <RadioGroup name="businessType">
                <FormControlLabel value="Sole Proprietorship" control={<Radio />} label="Sole Proprietorship" />
                <FormControlLabel value="Partnership" control={<Radio />} label="Partnership" />
                <FormControlLabel value="Corporation" control={<Radio />} label="Corporation" />
                <FormControlLabel value="LLC" control={<Radio />} label="LLC" />
                <FormControlLabel value="Non-Profit" control={<Radio />} label="Non-Profit" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">Save and Close</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CustomerModal;
