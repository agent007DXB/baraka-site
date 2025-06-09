import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_UPLOAD_PRESET = "baraka_uploads";
  const CLOUDINARY_CLOUD_NAME = "db7hngfzu";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!method || !amount) return alert("Please fill in all fields");

    try {
      setStatus("processing");

      let proofURL = "";

      if (proofFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", proofFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "deposits");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        proofURL = data.secure_url;
        setUploading(false);
      }

      await addDoc(collection(db, "deposits"), {
        amount: parseFloat(amount),
        method,
        date: Timestamp.now(),
        userId: auth.currentUser?.uid || "guest",
        status: "processing",
        proofURL
      });

      alert("✅ Deposit submitted successfully!");
      setAmount("");
      setMethod("");
      setProofFile(null);
      setStatus("processing");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("❌ Failed to submit deposit.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">💰 Deposit Funds</h2>
      <p className="mb-4 text-gray-600">
        Please select a payment method, transfer funds, then upload your deposit proof.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border rounded"
          required
        />

        <div className="space-y-2">
          <label className="block font-semibold">Payment Method:</label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="method"
              value="bank"
              onChange={(e) => setMethod(e.target.value)}
              checked={method === "bank"}
            />
            <span>🏦 Bank Transfer</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="method"
              value="crypto"
              onChange={(e) => setMethod(e.target.value)}
              checked={method === "crypto"}
            />
            <span>💸 Crypto (USDT)</span>
          </label>
        </div>

        {method === "bank" && (
          <div className="bg-gray-100 p-3 rounded">
            <p><strong>Bank Name:</strong> ABC Bank</p>
            <p><strong>Account Number:</strong> 123456789</p>
            <p><strong>IFSC:</strong> ABCD12345</p>
            <p><strong>Account Name:</strong> Baraka Investments</p>
          </div>
        )}

        {method === "crypto" && (
          <div className="bg-gray-100 p-3 rounded">
            <p><strong>USDT (TRC20):</strong> T9zS1eQyWz1Ez6gX2f29Wxyz5sdqPq</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=T9zS1eQyWz1Ez6gX2f29Wxyz5sdqPq"
              alt="QR Code"
              className="mt-2"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Upload Proof (image/PDF):</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setProofFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? "Uploading..." : "Submit Deposit"}
        </button>

        {status && (
          <div className="mt-4 text-yellow-600">
            🕐 Status: <strong>{status}</strong>
          </div>
        )}
      </form>
    </div>
  );
}
