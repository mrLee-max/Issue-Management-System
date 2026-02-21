// notifications.js
import { messaging, db, auth } from "../firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

// Request browser notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey: "YOUR_WEB_PUSH_PUBLIC_KEY", // from Firebase console
      });

      console.log("FCM Token:", token);

      // Save token to Firestore under the current user
      if (auth.currentUser && token) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          { fcmToken: token },
          { merge: true }
        );
      }

      return token;
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Listen for foreground messages
export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received: ", payload);
    if (payload.notification) {
      alert(`${payload.notification.title}\n${payload.notification.body}`);
    }
  });
};
