
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

  const handleDepositStatus = async (depositId, newStatus) => {
    const depositRef = doc(db, 'deposits', depositId);
    await updateDoc(depositRef, { status: newStatus });
    setDeposits(prev =>
      prev.map(dep =>
        dep.id === depositId ? { ...dep, status: newStatus } : dep
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* KYC Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🧾 User KYC Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Occupation</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">DOB</th>
                <th className="p-2 border">Nationality</th>
                <th className="p-2 border">Income</th>
                <th className="p-2 border">KYC File</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.address || '-'}</td>
                  <td className="p-2 border">{user.occupation || '-'}</td>
                  <td className="p-2 border">{user.phone || '-'}</td>
                  <td className="p-2 border">{user.dob || '-'}</td>
                  <td className="p-2 border">{user.nationality || '-'}</td>
                  <td className="p-2 border">{user.income || '-'}</td>
                  <td className="p-2 border">
                    {user.kycUrl ? (
                      <a
                        href={user.kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      'No File'
                    )}
                  </td>
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

      {/* Deposit Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">💰 Deposit Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Method</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Proof</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((dep) => {
                const vip = dep.amount < 500 ? 0.2 : dep.amount <= 2000 ? 0.3 : 0.4;
                return (
                  <tr key={dep.id}>
                    <td className="p-2 border">{dep.userId}</td>
                    <td className="p-2 border">${dep.amount}</td>
                    <td className="p-2 border">{dep.method}</td>
                    <td className="p-2 border">{dep.date.toDate().toLocaleDateString()}</td>
                    <td className="p-2 border">
                      {dep.proofURL ? (
                        <a
                          href={dep.proofURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        'No Proof'
                      )}
                    </td>
                    <td className="p-2 border capitalize">{dep.status}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleDepositStatus(dep.id, 'confirmed')}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDepositStatus(dep.id, 'rejected')}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
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
