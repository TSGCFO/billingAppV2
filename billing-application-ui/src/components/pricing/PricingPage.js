import React, { useState } from 'react';
import CreatePricingForm from './CreatePricingForm'; // Ensure this path is correct

function PricingPage() {
  const [isFormOpen, setFormOpen] = useState(false);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <div>
      <h1>Pricing Management</h1>
      <p>Welcome to the Pricing Management page. Here you can manage all pricing related tasks.</p>
      <button onClick={handleOpenForm}>Create New Pricing</button>
      {isFormOpen && (
        <CreatePricingForm handleClose={handleCloseForm} />
      )}
      {/* Additional components or functionalities for pricing management can be added here */}
    </div>
  );
}

export default PricingPage;
