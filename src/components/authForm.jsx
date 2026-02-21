import React from "react";

const AuthForm = ({ title, buttonText, onSubmit, formData, setFormData, isSignup }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold p-3 rounded-lg hover:bg-orange-600 transition-all duration-200"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
