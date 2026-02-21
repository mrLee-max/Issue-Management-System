import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null); // selected file
  const [imageURL, setImageURL] = useState(""); // uploaded image URL
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  // 🟦 Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
      setFormData({ ...formData, name: data.name, email: data.email });
      setImageURL(data.profileImage || ""); // update profile image URL
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  // 🟦 Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟦 Image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) setProfileImage(e.target.files[0]);
  };

  // 🟦 Upload image to Firebase Storage
  const handleImageUpload = async () => {
    if (!profileImage) return;
    if (!user) return;
    const imageRef = ref(storage, `profileImages/${user.uid}_${profileImage.name}`);
    try {
      await uploadBytes(imageRef, profileImage);
      const downloadURL = await getDownloadURL(imageRef);
      setImageURL(downloadURL);

      // Save URL in Firestore
      await updateDoc(doc(db, "users", user.uid), { profileImage: downloadURL });
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image: " + err.message);
    }
  };

  // 🟦 Update name/email
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      alert("Please enter your current password to confirm changes.");
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
      });

      alert("Profile updated successfully!");
      setFormData({ ...formData, currentPassword: "" });
      fetchUserData();
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      alert("Please enter your current password.");
      return;
    }
    if (!formData.newPassword || formData.newPassword !== formData.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, formData.newPassword);
      alert("Password updated successfully!");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      alert("Error changing password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Prompt-based edit
  const handleEditDetails = async () => {
    const newName = prompt("Enter new full name:", userData.name);
    const newEmail = prompt("Enter new email:", userData.email);
    if (!newName || !newEmail) return;

    const password = prompt("Please confirm your password to save changes:");
    if (!password) return;

    setFormData({ ...formData, name: newName, email: newEmail, currentPassword: password });
    handleUpdateDetails(new Event("submit"));
  };

  const handleChangePasswordPrompt = async () => {
    const oldPass = prompt("Enter your current password:");
    const newPass = prompt("Enter your new password:");
    const confirmPass = prompt("Confirm your new password:");
    if (!oldPass || !newPass || !confirmPass) return;

    setFormData({
      ...formData,
      currentPassword: oldPass,
      newPassword: newPass,
      confirmNewPassword: confirmPass,
    });
    handleChangePassword(new Event("submit"));
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-info">
        <p><strong>Full Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      <div className="profile-image-upload">
        <img
          src={imageURL || "https://via.placeholder.com/150"}
          alt="Profile"
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 10
          }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>

      <div className="profile-buttons">
        <button onClick={handleEditDetails}>Edit Details</button>
        <button onClick={handleChangePasswordPrompt}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
