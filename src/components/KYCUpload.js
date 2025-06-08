// src/pages/KYCUpload.js
import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function KYCUpload() {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchKYCStatus = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setKycStatus(data.kycStatus || "not uploaded");
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatusMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusMessage("❗ Please select a file first.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setStatusMessage("❗ You must be logged in.");
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `kyc_uploads/${user.uid}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        kycFileUrl: fileUrl,
        kycStatus: "pending",
        email: user.email
      }, { merge: true });

      setStatusMessage("✅ File uploaded successfully. KYC is now pending approval.");
      setKycStatus("pending");
    } catch (error) {
      console.error("Upload failed:", error);
      setStatusMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">KYC Upload</h1>
      <p className="mb-4 text-gray-600">
        Upload a government-issued document (PDF or image).
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload KYC"}
      </button>

      {statusMessage && (
        <p className="mt-4 text-sm">{statusMessage}</p>
      )}

      {kycStatus && (
        <p className="mt-2 text-sm text-gray-700">
          <strong>KYC Status:</strong> {kycStatus.toUpperCase()}
        </p>
      )}
    </div>
  );
}
