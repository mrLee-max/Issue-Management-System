// import "@fortawesome/fontawesome-free/css/all.min.css";
// import React, { useState } from "react";
// import AuthForm from "../components/authForm";
// import { useNavigate, Link } from "react-router-dom";
// import { getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
// import { auth } from "../firebaseConfig";
// import "../styles/login.css"; // ✅ import your styling

// const LoginPage = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = formData;

//     try {
//       const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
//       await setPersistence(auth, persistence);

//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful!");
//       navigate("/dashboard");

//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   return (
//     <div className="auth-page">
//         <div className="limiter">
//           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    
//           <div className="container-login100">
//             <div className="wrap-login100 p-6 rounded-2xl shadow-lg">
//               <form onSubmit={handleLogin} className="login100-form validate-form">
//                 <span className="login100-form-title mb-6">
//                   Welcome Back
//                 </span>
    
//                 <div className="wrap-input100 validate-input mb-4">
//                   <input
//                     className="input100"
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     required
//                   />
//                   <span className="focus-input100"></span>
//                   <span className="symbol-input100">
//                     <i className="fa fa-envelope" aria-hidden="true"></i>
//                   </span>
//                 </div>
    
//                 <div className="wrap-input100 validate-input mb-6">
//                   <input
//                     className="input100"
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     required
//                   />
//                   <span className="focus-input100"></span>
//                   <span className="symbol-input100">
//                     <i className="fa fa-lock" aria-hidden="true"></i>
//                   </span>
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={() => setRememberMe(!rememberMe)}
//                     id="remember-me"
//                     className="mr-2"
//                   />
//                   <label htmlFor="remember-me" className="text-gray-200">
//                     Remember me
//                   </label>
//                 </div>
    
//                 <div className="container-login100-form-btn">
//                   <button type="submit" className="login100-form-btn">
//                     Login
//                   </button>
//                 </div>
    
//                 <div className="text-center mt-6">
//                   <p className="text-gray-200">
//                     Don’t have an account?{" "}
//                     <Link to="/register" className="text-white font-semibold hover:underline">
//                       Sign up
//                     </Link>
//                   </p>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//   </div>
//   );
// };

// export default LoginPage;

import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "../styles/login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // ✅ Set persistence BEFORE signing in
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // ✅ Now sign in with the persistence applied
      await signInWithEmailAndPassword(auth, email, password);
      
      alert("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="limiter">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>

        <div className="container-login100">
          <div className="wrap-login100 p-6 rounded-2xl shadow-lg">
            <form onSubmit={handleLogin} className="login100-form validate-form">
              <span className="login100-form-title mb-6">
                Welcome Back
              </span>

              <div className="wrap-input100 validate-input mb-4">
                <input
                  className="input100"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div className="wrap-input100 validate-input mb-6">
                <input
                  className="input100"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-me"
                  className="mr-2"
                />
                <label htmlFor="remember-me" className="text-gray-200">
                  Remember me
                </label>
              </div>

              <div className="container-login100-form-btn">
                <button type="submit" className="login100-form-btn">
                  Login
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-200">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-white font-semibold hover:underline">
                    Sign up
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

export default LoginPage;