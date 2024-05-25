import React, { useState } from 'react';
import CreatePricingForm from './CreatePricingForm'; // Ensure this path is correct
import axios from 'axios';

const PricingPage = () => {
  const [isFormOpen, setFormOpen] = useState(false);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const fetchPricingOptions = (customerId) => {
    return axios.get(`/api/pricing-options?customerId=${customerId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching pricing options:', error);
        return [];
      });
  };

  return (
    <div>
      <h1>Pricing Management</h1>
      <p>Welcome to the Pricing Management page. Here you can manage all pricing related tasks.</p>
      <button onClick={handleOpenForm}>Create New Pricing</button>
      {isFormOpen && (
        <CreatePricingForm handleClose={handleCloseForm} fetchPricingOptions={fetchPricingOptions} />
      )}
      {/* Additional components or functionalities for pricing management can be added here */}
    </div>
  );
}

export default PricingPage;
