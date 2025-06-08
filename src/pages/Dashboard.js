import React, { useEffect, useState, useContext } from "react"; // ✅ Added useContext
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { UserContext } from "../context/UserContext"; // ✅ Added UserContext import

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function getVIPRate(amount) {
  if (amount < 500) return 0.2;
  if (amount <= 2000) return 0.3;
  return 0.4;
}

function getDateRange(startDate, days) {
  const result = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    result.push(new Date(date));
  }
  return result;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function Dashboard() {
  const { user, userData } = useContext(UserContext); // ✅ Added UserContext to get user and userData
  const [deposits, setDeposits] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      if (!user) return; // ✅ Use user from UserContext instead of auth.currentUser

      const q = query(collection(db, "deposits"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const now = new Date();
      const depositData = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const depositDate = data.date.toDate();
        const days = Math.floor((now - depositDate) / (1000 * 60 * 60 * 24));
        const rate = getVIPRate(data.amount);
        depositData.push({ ...data, depositDate, rate, days });
      });

      const growthMap = {};

      depositData.forEach((dep) => {
        const dailyReturn = dep.amount * dep.rate;
        const dates = getDateRange(dep.depositDate, dep.days);
        dates.forEach((date) => {
          const key = formatDate(date);
          if (!growthMap[key]) {
            growthMap[key] = 0;
          }
          growthMap[key] += dailyReturn;
        });
      });

      const sortedDates = Object.keys(growthMap).sort();
      const totalReturns = [];
      let runningTotal = 0;
      sortedDates.forEach((date) => {
        runningTotal += growthMap[date];
        totalReturns.push({ date, total: runningTotal });
      });

      setChartData({
        labels: totalReturns.map((d) => d.date),
        datasets: [
          {
            label: "Cumulative Return ($)",
            data: totalReturns.map((d) => d.total.toFixed(2)),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
            fill: false,
          },
        ],
      });

      setDeposits(depositData);
      setLoading(false);
    };

    fetchDeposits();
  }, [user]); // ✅ Added user as a dependency

  if (loading || !userData) return <div className="p-6 text-center">Loading your dashboard...</div>; // ✅ Updated loading condition to include userData

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ✅ Added welcome message using userData.name */}
      <h1 className="text-2xl font-bold mb-6">
        📊 Investment Dashboard - Welcome, {userData.name || 'User'}!
      </h1>

      {chartData && (
        <div className="bg-white p-4 mb-8 shadow rounded">
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}

      <table className="w-full table-auto border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Method</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">VIP Level</th>
            <th className="p-2 border">Daily Return</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d, index) => {
            const vip = d.rate === 0.2 ? "VIP 1" : d.rate === 0.3 ? "VIP 2" : "VIP 3";
            return (
              <tr key={index}>
                <td className="p-2 border">${d.amount}</td>
                <td className="p-2 border">{d.method}</td>
                <td className="p-2 border">{d.depositDate.toLocaleDateString()}</td>
                <td className="p-2 border">{vip}</td>
                <td className="p-2 border">${Math.round(d.amount * d.rate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
