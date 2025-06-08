import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'deposits'), {
        amount: parseFloat(amount),
        method,
        date: Timestamp.now(),
        userId: auth.currentUser?.uid || 'guest'
      });

      alert('Deposit recorded successfully!');
      setShowDetails(true); // show payment instructions after submit
    } catch (error) {
      console.error('Error adding deposit:', error);
      alert('Error recording deposit.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Deposit Funds</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold mb-1">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            min={1}
            placeholder="Enter deposit amount"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="bank">Bank Transfer</option>
            <option value="crypto">Crypto (USDT)</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Deposit
        </button>
      </form>

      {showDetails && (
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Payment Instructions</h2>

          {method === 'bank' ? (
            <div>
              <p><strong>Bank Name:</strong> Baraka National Bank</p>
              <p><strong>Account Number:</strong> 12534446654</p>
              <p><strong>IFSC Code:</strong> BNB0001234</p>
              <p><strong>Account Holder:</strong> Baraka Investment</p>
            </div>
          ) : (
            <div>
              <p><strong>USDT Wallet Address (TRC20):</strong></p>
              <p className="break-all bg-gray-100 p-2 rounded text-sm">
                TYxqv8j9Ft2zbnQwYDUeB7gUAMhFqwGr67
              </p>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-600">
            After sending the amount, please wait for admin verification.
            Your deposit will be activated within 1–4 hours.
          </p>
        </div>
      )}
    </div>
  );
}
