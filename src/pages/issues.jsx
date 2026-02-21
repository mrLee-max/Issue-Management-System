import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "../styles/issues.css";

const Issues = () => {
  const { customerId } = useParams();
  const location = useLocation();
  const customerName = location.state?.customerName || "Unknown";

  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [viewIssueId, setViewIssueId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    assignedTo: "",
    status: "Open",
    priority: "Medium",
    remarks: "",
    dueDate: "",
  });

  const issuesCollection = collection(db, "issues");

  // 🟢 Fetch issues
  const fetchIssues = async () => {
    try {
      if (!customerId) return;

      const q = query(issuesCollection, where("customerId", "==", customerId));
      const snapshot = await getDocs(q);

      setIssues(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  // 🟢 Fetch staff
  const fetchStaff = async () => {
    const snapshot = await getDocs(collection(db, "staff"));
    setStaffList(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    fetchIssues();
    fetchStaff();
  }, [customerId]);

  // 🟢 Add / Update issue
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedIssue) {
        await updateDoc(doc(db, "issues", selectedIssue.id), {
          ...formData,
        });
        alert("Issue updated!");
      } else {
        await addDoc(issuesCollection, {
          ...formData,
          customerId,
          createdAt: new Date(),
        });
        alert("Issue added!");
      }

      setShowModal(false);
      setSelectedIssue(null);
      setFormData({
        title: "",
        assignedTo: "",
        status: "Open",
        priority: "Medium",
        remarks: "",
        dueDate: "",
      });

      fetchIssues();
    } catch (error) {
      console.error("Error saving issue:", error);
    }
  };

  // 🟡 Edit issue
  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setFormData(issue);
    setShowModal(true);
  };

  // 🔴 Delete issue
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "issues", id));
    alert("Issue deleted!");
    fetchIssues();
  };

  // 🟣 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="issues-page">
      <div className="issues-content">
        {/* HEADER */}
        <div className="issues-header">
          <h1>Issues for {customerName}</h1>
          <button className="btn btn-add" onClick={() => setShowModal(true)}>
            + Add Issue
          </button>
        </div>

        {/* TABLE */}
        <table className="issues-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <React.Fragment key={issue.id}>
                <tr>
                  <td>{issue.title}</td>
                  <td>{issue.assignedTo}</td>
                  <td className={`status ${issue.status.toLowerCase()}`}>
                    {issue.status}
                  </td>
                  <td className={`priority ${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </td>
                  <td>
                    <button
                      className="btn-text blue"
                      onClick={() => handleEdit(issue)}
                    >
                      ✏️
                    </button>
          
                    <button
                      className="btn-text red"
                      onClick={() => handleDelete(issue.id)}
                    >
                      ❌
                    </button>
          
                    <button
                      className="btn-text green"
                      onClick={() =>
                        setViewIssueId(viewIssueId === issue.id ? null : issue.id)
                      }
                    >
                      👁
                    </button>
                  </td>
                </tr>
          
                {viewIssueId === issue.id && (
                  <tr className="issue-details-row">
                    <td colSpan="5">
                      <div className="issue-details">
          
                        <p>
                          <strong>Remarks:</strong><br />
                          {issue.remarks || "No remarks"}
                        </p>
                        <div className="issue-media">
                          {issue.imageUrl && (
                            <div>
                              <strong>Image:</strong><br />
                              <img
                                src={issue.imageUrl}
                                alt="Issue"
                                className="issue-image"
                              />
                            </div>
                          )}
            
                          {issue.videoUrl && (
                            <div>
                              <strong>Video:</strong><br />
                              <video controls className="issue-video">
                                <source src={issue.videoUrl} />
                              </video>
                            </div>
                          )}
            
                          {issue.audioUrl && (
                            <div>
                              <strong>Audio:</strong><br />
                              <audio controls>
                                <source src={issue.audioUrl} />
                              </audio>
                            </div>
                          )}
                        </div>
          
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          
        </table>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{selectedIssue ? "Edit Issue" : "Add Issue"}</h2>

              <form onSubmit={handleSubmit}>
                <input
                  name="title"
                  placeholder="Issue Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <option value="">Select Staff</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.name}>
                      {staff.name}
                    </option>
                  ))}
                </select>

                <div className="form-row">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Open</option>
                    <option>Pending</option>
                    <option>Closed</option>
                  </select>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />

                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-submit">
                    {selectedIssue ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;
