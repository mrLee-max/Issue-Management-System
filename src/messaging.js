// // src/messaging.js
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { initializeApp } from "firebase/app";
// import { toast } from "react-toastify";
// import { doc, setDoc } from "firebase/firestore";
// import { firebaseConfig, db } from "./firebaseConfig"; // your Firestore export

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // Call this after user login to request permission and save token
// export async function registerForPush(userUid, vapidKey) {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.log("Notification permission denied");
//       return null;
//     }
//     const currentToken = await getToken(messaging, { vapidKey });
//     if (currentToken) {
//       // Save token to Firestore under users/{uid}.fcmToken (or a tokens collection)
//       await setDoc(doc(db, "users", userUid), { fcmToken: currentToken }, { merge: true });
//       return currentToken;
//     }
//     return null;
//   } catch (err) {
//     console.error("Error getting FCM token", err);
//     return null;
//   }
// }

// // Foreground message handler (show toast)
// export function setupOnMessageHandler() {
//   onMessage(messaging, (payload) => {
//     const notif = payload.notification;
//     if (notif) {
//       toast.info(`${notif.title}: ${notif.body}`);
//     } else {
//       toast.info("New message received");
//     }
//   });
// }
