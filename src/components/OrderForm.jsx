import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useOrderContext } from '../context/OrderContext';

const OrderForm = () => {
  const { selectedPackage } = useOrderContext();
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const quantity = selectedPackage?.quantity || 1;
  const price = selectedPackage?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    if (!quantity || !price) {
      setError('Invalid package selection. Quantity or price is missing.');
      return;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName.trim(),
            quantity,
            price,
            item: selectedPackage?.name || 'Unknown Package',
            order_status: 'pending',
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        setError('Error saving order: ' + supabaseError.message);
        return;
      }

      console.log('Order saved successfully:', data);
      setSuccess('Order saved successfully!');
      setCustomerName('');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('Unexpected error: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Place an Order</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Quantity:</label>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Price:</label>
          <input
            type="number"
            value={price}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;