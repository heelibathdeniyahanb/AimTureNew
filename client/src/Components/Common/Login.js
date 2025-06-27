import React, { useState,useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { useUser } from './path/to/UserContext'; // Adjust the import path
import { UserContext } from "../UserContext";
import Cookies from "js-cookie";
import ForgotPasswordModal from "./Password/ForgotPassword";


const Login = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7295/api/auth/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        const { id, firstName, lastName, email, role, token, dateOfBirth, gender } = response.data;
  
        // Set user data in the context
        const userData = { id, firstName, lastName, email, role, dateOfBirth, gender };
        setUser(userData);
  
        // Store user data and token in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        Cookies.set("jwt", token); // Store token in localStorage
  
        toast.success("Login successful!");
  
        // Navigate based on role
        if (role === "Admin") {
          navigate("/admin/dashboard/Page");
        } else if (role === "User") {
          navigate("/user/dashboard/page");
        } else if (role === "Marketing manager") {
          navigate("/marketing/dashboard");
        } else {
          setError("Unauthorized role");
        }
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid login credentials");
    }
  };
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen ">
    
      <div className=" p-8 rounded-lg shadow-lg w-[1000px] ">
        <h1 className="text-3xl text-center text-[#F0F4F8] mb-6 ">
          WELCOME to AIMTURE
        </h1>
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="flex justify-center">
          <div>
            <div className="mb-4 ">
              <div className=" absolute mt-3 ml-2"><FaUser className="text-[#56B2BB]" /></div>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[300px] px-8 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8] font-serif"
              />
            </div>
            <div className="mb-4">
              <div className="absolute mt-3 ml-2">
                <RiLockPasswordFill className="text-[#56B2BB]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}  // Toggle between text and password
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[300px] px-8 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8] text-opacity-35 font-serif"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-[#BAC7CC] focus:outline-none -ml-8"
              >
                {showPassword ? (
                  <FaRegEyeSlash className="text-[#BAC7CC] opacity-35" />
                ) : (
                  <FaRegEye className="text-[#BAC7CC] opacity-35" />
                )}
              </button>
            </div>

            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input id="remember" type="checkbox" value="" className="w-4 h-4 border-2 border-[#56B2BB] rounded bg-[#D9D9D9] opacity-20 focus:ring-3 focus:ring-blue-300" required />
              </div>
              <label htmlFor="remember" className="ms-2 text-sm font-medium text-[#F0F4F8] opacity-35">Remember me</label>
              <div className="ml-20 text-[#56B2BB] cursor-pointer" onClick={() => setShowForgotModal(true)}>
                Forget Password?
              </div>

            </div>
            
            <button
              type="submit"
              className="w-[300px] bg-[#56B2BB] border-2 border-[#56B2BB] text-[#F0F4F8] py-2 rounded-lg text-xl"
            >
             LOGIN
            </button>
            <hr className="h-px my-8 bg-gray-200 border-0" />
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-[#F0F4F8] opacity-40 text-sm mt-3">
           If you do not have an account
          </p>
          <button type="submit"
            className="w-[300px] bg-[#56B2BB] border-2 border-[#56B2BB] text-[#F0F4F8] py-2 rounded-lg text-xl"> 
            <Link to="/register-form" className="hover:underline">
              REGISTER
            </Link>
          </button>
        </div>
      </div>
      <ToastContainer />
      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />

    </div>
  );
};

export default Login;
