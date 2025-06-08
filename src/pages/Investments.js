import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Investments() {
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(
          collection(db, 'deposits'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate().toLocaleDateString(),
        }));
        setInvestments(data);
      } else {
        setUser(null);
        setInvestments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const chartData = {
    labels: investments.map(inv => inv.date),
    datasets: [
      {
        label: 'Daily Return',
        data: investments.map(inv => (inv.amount * getReturnRate(inv.amount))),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const getReturnRate = (amount) => {
    if (amount < 500) return 0.2;
    if (amount <= 2000) return 0.3;
    return 0.4;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Investments</h1>

      {!user && (
        <p className="text-red-500">Please log in to view your investments.</p>
      )}

      {user && investments.length > 0 && (
        <>
          <div className="bg-white p-4 shadow rounded mb-6">
            <Line data={chartData} options={{ responsive: true }} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Daily Return</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-4 py-2 border">{inv.date}</td>
                    <td className="px-4 py-2 border">${inv.amount}</td>
                    <td className="px-4 py-2 border">
                      ${Math.round(inv.amount * getReturnRate(inv.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {user && investments.length === 0 && (
        <p className="text-gray-600">No investments found yet.</p>
      )}
    </div>
  );
}
