// src/pages/KYCVerification.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function KYCVerification() {
  const [form, setForm] = useState({
    address: "",
    occupation: "",
    phone: "",
    dob: "",
    nationality: "",
    income: ""
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a document to upload");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "baraka_uploads");

    const res = await fetch("https://api.cloudinary.com/v1_1/db7hngfzu/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const kycUrl = await handleUpload();

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        kycUrl,
        kycStatus: "pending",
        email: user.email,
      }, { merge: true });

      alert("✅ KYC Submitted and is under review");
    } catch (err) {
      console.error(err);
      alert("Failed to submit KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">🔒 KYC Verify Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="address" onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" required />
        <input name="occupation" onChange={handleChange} placeholder="Occupation" className="w-full p-2 border rounded" required />
        <input name="phone" onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded" required />
        <input name="dob" type="date" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="nationality" onChange={handleChange} placeholder="Nationality" className="w-full p-2 border rounded" required />
        <select name="income" onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Income Range</option>
          <option value="< $1,000">Less than $1,000</option>
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="> $5,000">More than $5,000</option>
        </select>

        <div>
          <label className="font-semibold block mb-1">Upload Document (PDF or image):</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          {submitting ? "Submitting..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
}
