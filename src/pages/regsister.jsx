// import React, { useState } from "react";
// import AuthForm from "../components/authForm";
// import { useNavigate, Link } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { db, auth } from "../firebaseConfig";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { name, email, password } = formData;

//     try {
//       // ✅ Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // ✅ Set display name
//       await updateProfile(userCredential.user, { displayName: name });

//       // ✅ Store user data in Firestore
//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         uid: userCredential.user.uid,
//         name,
//         email,
//         role: "member", // default role
//         createdAt: serverTimestamp(),
//       });

//       alert("Signup successful!");
//       navigate("/dashboard"); // ✅ redirect after signup
//     } catch (error) {
//       alert("Signup failed: " + error.message);
//     }
//   };

//   return (
//     <div>
//       <AuthForm
//         title="Create Your Account"
//         buttonText="Sign Up"
//         onSubmit={handleSignup}
//         formData={formData}
//         setFormData={setFormData}
//         isSignup={true}
//       />
//       <p className="text-center mt-4 text-gray-700">
//         Already have an account?{" "}
//         <Link to="/" className="text-orange-600 font-semibold hover:underline">
//           Login
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default SignupPage;


import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from "react";
import AuthForm from "../components/authForm";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../styles/login.css"; // ✅ same CSS as login page

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Set display name
      await updateProfile(userCredential.user, { displayName: name });

      // ✅ Store user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role: "member", // default role
        createdAt: serverTimestamp(),
      });

      alert("Signup successful!");
      navigate("/dashboard"); // redirect after signup
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="auth-page">  
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-6 rounded-2xl shadow-lg">
            <form onSubmit={handleSignup} className="login100-form validate-form">
              <span className="login100-form-title mb-6">Create Your Account</span>

              {/* Name input */}
              <div className="wrap-input100 validate-input mb-4">
                <input
                  className="input100"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>

              {/* Email input */}
              <div className="wrap-input100 validate-input mb-4">
                <input
                  className="input100"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              {/* Password input */}
              <div className="wrap-input100 validate-input mb-6">
                <input
                  className="input100"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              {/* Submit button */}
              <div className="container-login100-form-btn">
                <button type="submit" className="login100-form-btn">
                  Sign Up
                </button>
              </div>

              {/* Footer text */}
              <div className="text-center mt-6">
                <p className="text-gray-200">
                  Already have an account?{" "}
                  <Link to="/" className="text-white font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
