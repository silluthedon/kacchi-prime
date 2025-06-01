import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Submitting order:', { customer_name: customerName, item: item, quantity: quantity });
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { customer_name: customerName, item: item, quantity: quantity },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      alert('Error saving order: ' + error.message);
    } else {
      console.log('Order saved successfully:', data);
      alert('Order saved successfully!');
      setCustomerName('');
      setItem('');
      setQuantity(1);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('Unexpected error: ' + err.message);
  }
};

  return (
    <div>
      <h2>Place an Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item:</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;