import React, { useState } from "react";
import { useRegisterMutation } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";


const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(""); 
  
  
  const [register, { isLoading, isError }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      // alert("Please complete the reCAPTCHA");
      toast.error("Please complete the reCAPTCHA",{
        position: "top-right",
      });
      return;
    }

    const userData = {
      username,
      email,
      password,
      confirm_password: confirmPassword,
      recaptcha_token: recaptchaToken,
    };

    try {
      await register(userData).unwrap();
      navigate("/login"); 
      toast.success("Check your email for email varification.",{
        position: "top-right",
      });
    } catch (err) {
      // console.error("Registration failed", err);
      toast.error("Registration failed. Try again.",{
        position: "top-right",
      });
    }
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRecaptchaToken("");
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="username"
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="new-password"
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            {/* reCAPTCHA */}
            <div className="mb-4">
              <ReCAPTCHA onChange={handleRecaptchaChange} sitekey="6LfBoCUqAAAAANK0D6PiKt9W3og-BDnz6UPZFNT2" />
            </div>
  
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              Register
            </button>
            {isError && <p className="text-red-500 text-center mt-4">Error during registration. Try again.</p>}
          </form>
          <div className="">
            <p className="text-center mt-4 text-black">Already have an account? {" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
};

export default Registration;
