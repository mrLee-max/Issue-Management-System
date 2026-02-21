import React, { useEffect, useState } from "react";
import {
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "../styles/customers.css";
import { useTheme } from "../ThemeContext";


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  const navigate = useNavigate(); // ✅ Initialize navigation

  // 🟢 Fetch data from Firestore
useEffect(() => {
  const fetchCustomers = async () => {
  try {
    const customerSnapshot = await getDocs(collection(db, "customers"));
    const customersData = [];

    for (const customerDoc of customerSnapshot.docs) {
      const customerId = customerDoc.id;
      const customerData = { id: customerId, ...customerDoc.data() };

      // 🔍 Fetch all issues related to this customer
      const issuesSnapshot = await getDocs(collection(db, "issues"));
      const issues = issuesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((issue) => issue.customerId === customerId);

      // 🧮 Count based on issue status or priority
      customerData.totalIssues = issues.length;
      customerData.openIssues = issues.filter((i) => i.status === "Open").length;
      customerData.progressIssues = issues.filter((i) => i.status === "In Progress").length;
      customerData.closedIssues = issues.filter((i) => i.status === "Closed").length;

      customerData.lowPriority = issues.filter((i) => i.priority === "Low").length;
      customerData.mediumPriority = issues.filter((i) => i.priority === "Medium").length;
      customerData.highPriority = issues.filter((i) => i.priority === "High").length;
      customerData.criticalPriority = issues.filter((i) => i.priority === "Critical").length;

      customersData.push(customerData);
    }

    setCustomers(customersData);
  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    setLoading(false);
  }
};

  fetchCustomers();
}, []);


  // 🟢 Add or Edit Restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        // ✏️ Update existing restaurant
        const docRef = doc(db, "customers", selectedCustomer.id);
        await updateDoc(docRef, {
          restaurantName: formData.restaurantName,
          lastUpdate: serverTimestamp(),
        });
      } else {
        // ➕ Add new restaurant
        const customerRef = doc(collection(db, "customers"));

        await setDoc(customerRef, {
          restaurantId: customerRef.id, // 🔥 STORE IT
          restaurantName: formData.restaurantName,
          totalIssues: 0,
          openIssues: 0,
          progressIssues: 0,
          closedIssues: 0,
          lowPriority: 0,
          mediumPriority: 0,
          highPriority: 0,
          criticalPriority: 0,
          lastUpdate: serverTimestamp(),
        });
      }

      setShowModal(false);
      setFormData({ restaurantName: "" });
      setSelectedCustomer(null);

      // 🧩 Refresh the table
      const querySnapshot = await getDocs(collection(db, "customers"));
      setCustomers(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  // 🔴 Delete Restaurant
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      setCustomers(customers.filter((cust) => cust.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // 🟡 Edit Restaurant
  const handleEdit = (cust) => {
    setSelectedCustomer(cust);
    setFormData({ restaurantName: cust.restaurantName });
    setShowModal(true);
  };

  // 🟣 Navigate to Customer's Issues Page
  const handleViewIssues = (cust) => {
    navigate(`/issues/${cust.id}`, { state: { customerName: cust.restaurantName } });
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div className="customers-container" style={{
      backgroundColor: theme.backgroundColor, 
      color: theme.textColor,
    }}>
      <div className="customers-header">
        <h1>👨‍💼 Restaurant Customers</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          + Add Restaurant
        </button>
      </div>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Restaurant Name</th>
            <th>Total Issues</th>
            <th>Open</th>
            <th>In Progress</th>
            <th>Closed</th>
            <th>Low</th>
            <th>Medium</th>
            <th>High</th>
            <th>Critical</th>
            <th>Last Update</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.id}>
              <td>{cust.restaurantName}</td>
              <td>{cust.totalIssues ?? 0}</td>
              <td>{cust.openIssues ?? 0}</td>
              <td>{cust.progressIssues ?? 0}</td>
              <td>{cust.closedIssues ?? 0}</td>
              <td>{cust.lowPriority ?? 0}</td>
              <td>{cust.mediumPriority ?? 0}</td>
              <td>{cust.highPriority ?? 0}</td>
              <td>{cust.criticalPriority ?? 0}</td>
              <td>
                {cust.lastUpdate?.seconds
                  ? new Date(cust.lastUpdate.seconds * 1000).toLocaleString()
                  : "—"}
              </td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => handleEdit(cust)} className="action-btn edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(cust.id)} className="action-btn delete">
                  Delete
                </button>
                {/* // ⬇️ Replace button code: */}
                <button
                  onClick={() =>
                    navigate(`/issues/${cust.id}`, {
                      state: { customerName: cust.restaurantName },
                    })
                  }
                  className="action-btn view"
                >
                  View Issues
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🟢 Modal for Add/Edit Restaurant */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{selectedCustomer ? "Edit Restaurant" : "Add New Restaurant"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="restaurantName"
                placeholder="Restaurant Name"
                value={formData.restaurantName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    restaurantName: e.target.value,
                  })
                }
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedCustomer ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
