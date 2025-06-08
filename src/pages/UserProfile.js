// src/pages/UserProfile.js
import React from 'react';
import KYCUpload from '../components/KYCUpload';

export default function UserProfile() {
  const user = {
    name: 'KD',
    email: 'kd@example.com',
    kycStatus: 'Pending',
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        <div>
          <label className="font-semibold">Name:</label>
          <p>{user.name}</p>
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <p>{user.email}</p>
        </div>
        <div>
          <label className="font-semibold">KYC Status:</label>
          <p>{user.kycStatus}</p>
        </div>

        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">
          Logout
        </button>
      </div>

      <KYCUpload />
    </div>
  );
}
