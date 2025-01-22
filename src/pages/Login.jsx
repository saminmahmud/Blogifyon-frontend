import React, { useContext, useState } from "react";
import { useLoginMutation } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from "../context/AuthContext";
import { isAuthenticated } from "../auth/auth";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(""); 
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [login, { isLoading, isError }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password, recaptcha_token: recaptchaToken };

    try {
      const response = await login(credentials).unwrap();
      localStorage.setItem("token", response.token); 
      localStorage.setItem("user_id", response.user_id);
      setIsLoggedIn(isAuthenticated());
      navigate("/"); 
    } catch (err) {
      // console.error("Login failed", err);
      toast.error("Login failed. Please try again.",{
        position: "top-right",
      });
    }

    setEmail("");
    setPassword("");
    setRecaptchaToken("");
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              // value="nahid@gmail.com"
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
              // value="admin12345"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/*reCAPTCHA */}
          <div className="mb-4">
            <ReCAPTCHA onChange={handleRecaptchaChange} sitekey="6LfBoCUqAAAAANK0D6PiKt9W3og-BDnz6UPZFNT2" />
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            Login
          </button>

          {isError && (
            <p className="text-red-500 text-center mt-4">Invalid credentials. Please try again.</p>
          )}
        </form>
        <div className="">
          <p className="text-center mt-4 text-black">Don't have an account? {" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
