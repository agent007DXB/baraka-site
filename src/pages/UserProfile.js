// src/pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import KYCUpload from '../components/KYCUpload';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKycStatus(data.kycStatus || 'Pending');
        } else {
          setKycStatus('Not found');
        }
      } else {
        setUser(null);
        setKycStatus('Not logged in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      window.location.href = '/login';
    });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        <div>
          <label className="font-semibold">Name:</label>
          <p>{user?.displayName || '-'}</p>
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <p>{user?.email}</p>
        </div>
        <div>
          <label className="font-semibold">KYC Status:</label>
          <p>{kycStatus}</p>
        </div>

        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">
          Logout
        </button>
      </div>

      <KYCUpload />
    </div>
  );
}
