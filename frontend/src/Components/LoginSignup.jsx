import axiosinstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginSignup() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true); // Show login form by default
  const [accountType, setAccountType] = useState("user"); // Default is 'user'

  // Common states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup-specific states
  const [name, setName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("doctor"); // Default role for userole

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("All fields are required");

    try {
      const endpoint = accountType === "user" ? "user/login" : "userole/login";
      const payload = accountType === "user"
        ? { email, password }
        : { email, password, role };

      const res = await axiosinstance.put(endpoint, payload, { withCredentials: true });

      // Store user data (including role)
      const userData = res.data.data;
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(userData);
      // Check role and navigate accordingly
      const userRole = userData.role; // Assuming role is included in the response
      if (userRole === "admin" || userRole === "superadmin") {
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else if (userRole === 'doctor') {
        navigate("/dashboard"); // Redirect to doctor dashboard
      } else if (userRole === "user") {
        navigate("/user/dashboard");
      } else if (userRole === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/"); // Redirect to home
      }

      alert("Login success");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !signupPassword || !mobile) {
      return alert("All fields are required");
    }

    if (signupPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const endpoint = accountType === "user" ? "user/signup" : "userole/signup";
      const payload = accountType === "user"
        ? { name, email, password: signupPassword, mobile }
        : { name, email, password: signupPassword, mobile, role };

      const res = await axiosinstance.post(endpoint, payload, { withCredentials: true });
      alert("Signup success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err);
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left panel */}
          <div className="bg-blue-600 text-white p-8 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl font-bold mb-4">Welcome to HomleyCare</h1>
            <p className="text-lg max-w-xs">
              Track your health and donations in one place.
            </p>
          </div>

          {/* Right panel - forms */}
          <div className="p-8">
            {/* Toggle Account Type */}
            <div className="flex space-x-4 justify-center md:justify-start mb-4">
              <button
                onClick={() => setAccountType("user")}
                className={`font-semibold px-3 py-1 rounded-t border-b-2 ${
                  accountType === "user"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600`}
              >
                User
              </button>
              <button
                onClick={() => setAccountType("userole")}
                className={`font-semibold px-3 py-1 rounded-t border-b-2 ${
                  accountType === "userole"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600`}
              >
                Admin/Doctor/Staff
              </button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="flex space-x-4 justify-center md:justify-start mb-6">
              <button
                onClick={() => setShowLogin(true)}
                className={`font-semibold px-3 py-1 rounded-t border-b-2 ${
                  showLogin
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600`}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`font-semibold px-3 py-1 rounded-t border-b-2 ${
                  !showLogin
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600`}
              >
                Signup
              </button>
            </div>

            {/* Forms */}
            {showLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {accountType === "userole" && (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                  </select>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {accountType === "userole" && (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                  </select>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





