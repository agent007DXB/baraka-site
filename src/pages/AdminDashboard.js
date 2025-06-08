// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userSnap = await getDocs(collection(db, 'users'));
      const userList = userSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };

    const fetchDeposits = async () => {
      const q = query(collection(db, 'deposits'), orderBy('date', 'desc'));
      const depositSnap = await getDocs(q);
      const depositList = depositSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeposits(depositList);
    };

    fetchUsers();
    fetchDeposits();
  }, []);

  const handleKYC = async (userId, status) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      kycStatus: status
    });
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, kycStatus: status } : user
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🧾 User KYC Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">KYC Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border capitalize">{user.kycStatus || 'pending'}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleKYC(user.id, 'approved')}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleKYC(user.id, 'rejected')}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">💰 All Deposits</h2>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Method</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Daily Return</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((dep) => {
                const vip = dep.amount < 500 ? 0.2 : dep.amount <= 2000 ? 0.3 : 0.4;
                const dailyReturn = dep.amount * vip;
                return (
                  <tr key={dep.id}>
                    <td className="p-2 border">{dep.userId}</td>
                    <td className="p-2 border">${dep.amount}</td>
                    <td className="p-2 border">{dep.method}</td>
                    <td className="p-2 border">{dep.date.toDate().toLocaleDateString()}</td>
                    <td className="p-2 border">${Math.round(dailyReturn)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
