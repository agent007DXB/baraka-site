import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { ...userData, email: user.email }, { merge: true });
    alert("Profile updated ✅");
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

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
