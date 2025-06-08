// src/pages/WithdrawRequest.js
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function WithdrawRequest() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !method) {
      setStatusMsg("❗ Please enter all required fields.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setStatusMsg("❗ You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        email: user.email,
        amount: parseFloat(amount),
        method,
        note,
        status: "pending",
        date: serverTimestamp()
      });
      setStatusMsg("✅ Withdrawal request submitted successfully.");
      setAmount("");
      setMethod("");
      setNote("");
    } catch (error) {
      console.error("Withdraw error:", error);
      setStatusMsg("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Withdraw Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="bank">Bank Transfer</option>
            <option value="crypto">Crypto Wallet</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Note (Bank or Wallet Details)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="e.g. Wallet address or bank account info"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {statusMsg && <p className="mt-3 text-sm">{statusMsg}</p>}
      </form>
    </div>
  );
}
