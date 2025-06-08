// src/pages/Profile.js
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          name: data.name || "",
          email: firebaseUser.email,
          phone: data.phone || "",
          address: data.address || ""
        });
      } else {
        // If no profile exists, show auth email only
        setUserData({
          name: "",
          email: firebaseUser.email,
          phone: "",
          address: ""
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        email: user.email,
      },
      { merge: true }
    );
    alert("✅ Profile updated successfully");
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
      <div className="space-y-4">
        <input
          name="name"
          value={userData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />
        <input
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
        />
        <input
          name="address"
          value={userData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Address"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
