import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from './ThemeContext';

const issue = "Test issue"; 

toast.info("You have a new issue assigned: " + issue.title);
// on deadline near:
toast.warning(`Issue "${issue.title}" is due soon`);

toast.success("New issue assigned!");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <ToastContainer position="bottom-right" />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// functions/index.js
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// HTTP function to send message to a single user (used when admin assigns issue)
// exports.sendNotificationToUser = functions.https.onRequest(async (req, res) => {
//   // Expect { uid, title, body, data }
//   try {
//     const { uid, title, body, data } = req.body;
//     if (!uid || !title) return res.status(400).send("Missing fields");

//     // Read user's fcmToken from Firestore
//     const userDoc = await admin.firestore().doc(`users/${uid}`).get();
//     if (!userDoc.exists) return res.status(404).send("User not found");
//     const token = userDoc.data().fcmToken;
//     if (!token) return res.status(400).send("User has no token");

//     const payload = {
//       notification: { title, body },
//       data: data || {},
//     };

//     const response = await admin.messaging().sendToDevice(token, payload);
//     return res.status(200).send(response);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send(err.message);
//   }
// });

// Scheduled function — run every day at 9:00 (example)
// exports.dailyDeadlineChecker = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
//   const db = admin.firestore();
//   const now = admin.firestore.Timestamp.now();
//   // get issues with dueDate within next 24h and status not closed
//   const tomorrow = admin.firestore.Timestamp.fromMillis(Date.now() + 24 * 3600 * 1000);
//   const snapshot = await db.collection('issues')
//     .where('dueDate', '<=', tomorrow)
//     .where('status', 'in', ['Open', 'In Progress'])
//     .get();

//   const messages = [];

//   snapshot.forEach(docSnap => {
//     const issue = docSnap.data();
//     // push message for assigned user(s)
//     if (issue.assignedToUid) {
//       messages.push({ uid: issue.assignedToUid, title: 'Issue due soon', body: `Issue "${issue.title}" is due within 24 hours` });
//     }
//   });

  // send notifications
  // for (const msg of messages) {
  //   try {
  //     const userDoc = await db.doc(`users/${msg.uid}`).get();
  //     const token = userDoc.data()?.fcmToken;
  //     if (token) {
  //       await admin.messaging().sendToDevice(token, {
  //         notification: { title: msg.title, body: msg.body }
  //       });
  //     }
  //   } catch (e) {
  //     console.error('send error', e);
  //   }
  // }

  // return null;
// });
