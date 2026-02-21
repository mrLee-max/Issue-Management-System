 import React, { useEffect, useState } from "react";
import "../styles/manageUsers.css";
import { app, db, getStorage } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

const ManageUsers = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    staffId: "",
    passcode: "",
    id: "", // for editing
  });
  const [loading, setLoading] = useState(false);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // preview URL

  // Fetch staff
  const fetchStaff = async () => {
    const querySnapshot = await getDocs(collection(db, "staff"));
    const staffData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStaffList(staffData);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // show preview instantly
    }
  };

  // Generate Staff ID & Passcode
  const generateStaffId = () => {
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData({ ...formData, staffId: id });
  };

  const generatePasscode = () => {
    const pass = Math.random().toString(36).substring(2, 8);
    setFormData({ ...formData, passcode: pass });
  };

  // Add or update staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = imagePreview || "";

      if (imageFile) {
        const imageRef = ref(
          storage,
          `staff/${formData.staffId || Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(imageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (formData.id) {
        // Update existing staff
        const staffRef = doc(db, "staff", formData.id);
        await updateDoc(staffRef, {
          name: formData.name,
          staffId: formData.staffId,
          passcode: formData.passcode,
          imageUrl: uploadedImageUrl,
        });
        alert("Staff updated successfully!");
      } else {
        // Add new staff
        await addDoc(collection(db, "staff"), {
          name: formData.name,
          staffId: formData.staffId,
          passcode: formData.passcode,
          imageUrl: uploadedImageUrl,
          createdAt: serverTimestamp(),
        });
        alert("Staff added successfully!");
      }

      // Reset form
      setFormData({ name: "", staffId: "", passcode: "", id: "" });
      setImageFile(null);
      setImagePreview("");
      fetchStaff();
    } catch (error) {
      alert("Error saving staff: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      await deleteDoc(doc(db, "staff", id));
      fetchStaff();
    }
  };

  return (
    <div className="manage-users-container">
      <div className="manage-users-content">
        <h1>Manage Staff</h1>

        {/* Add / Edit Staff Form */}
        <form onSubmit={handleAddStaff} className="add-user-form">
          <h2>Add / Edit Staff</h2>

          <input
            type="text"
            name="name"
            placeholder="Staff Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="input-with-button">
            <label>Profile Image:</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 8,
                }}
              />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="input-with-button">
            <input
              type="text"
              name="staffId"
              placeholder="Staff ID"
              value={formData.staffId}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={generateStaffId}>
              Generate
            </button>
          </div>

          <div className="input-with-button">
            <input
              type="password"
              name="passcode"
              placeholder="Passcode"
              value={formData.passcode}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={generatePasscode}>
              Generate
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Staff"}
          </button>
        </form>

        {/* Staff Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Staff ID</th>
              <th>Passcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    {staff.imageUrl ? (
                      <img
                        src={staff.imageUrl}
                        alt={staff.name}
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>{staff.name}</td>
                  <td>{staff.staffId}</td>
                  <td>{staff.passcode}</td>
                  <td>
                    <button
                      onClick={() =>
                        setFormData({
                          name: staff.name,
                          staffId: staff.staffId,
                          passcode: staff.passcode,
                          id: staff.id,
                        }) && setImagePreview(staff.imageUrl || "")
                      }
                    >
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteStaff(staff.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No staff found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
