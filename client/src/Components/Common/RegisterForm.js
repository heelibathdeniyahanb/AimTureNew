import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import { useTheme } from '../ThemeContext'; // Import the theme context

const RegisterForm = () => {
  //const { isDarkMode } = useTheme(); // Access the theme context
  const [firstName ,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth,setDateOfBirth]=useState('');
  const [gender,setGender]=useState('');
 const [success]=useState('');
  const [error, setError] = useState('');
 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7295/api/auth/register', {
        email,
        firstName,
        lastName,
        mobileNo,
        dateOfBirth,
        gender,
        role: "User"
       
      });

      toast.success("Registration successful! You can now log in.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Display specific error messages if available
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`flex min-h-screen justify-center items-center `}>
      <form
        onSubmit={handleRegister}
        className={`p-6 rounded-lg shadow-lg w-96 `}
      >
        <h2 className={`text-3xl font-semibold text-center mb-6 text-[#F0F4F8]`}>Sign up as an user</h2> 
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className='mb-4 flex'>
          <div><label className='block text-sm font-bold mb-2 text-[#F0F4F8] opacity-35'>First Name</label>
          <input
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            aria-label="FirstName"
            className={`w-full px-3 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8]`}
          /></div>

<div><label className='block mx-3 text-sm font-bold mb-2 text-[#F0F4F8] opacity-35'>Last Name</label>
          <input
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            aria-label="LastName"
            className={`w-full mx-3 px-3 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8]`}
          /></div>
          
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 text-[#F0F4F8] opacity-35`}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
            className={`w-full px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D91A]  border-2 border-[#56b2bb] text-[#F0F4F8] `}
          />
        </div>

       
         <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 text-[#F0F4F8] opacity-35 `}>Mobile Number:</label>
          <PhoneInput
            country={'lk'}
            value={mobileNo}
            onChange={setMobileNo}
            inputStyle={{
              width: '100%',
              padding: '10 px 12px',
              border: '2px solid #56B2BB',
              borderRadius: '8px',
              backgroundColor:  '#D9D9D91A' ,
              color:  '#F0F4F8',
            }}
            dropdownStyle={{
              border: '2px solid #56B2BB',
              borderRadius: '8px',
              backgroundColor: '#D9D9D91A' ,
              color:  '#1D2233',
            }}
          />
        </div>

        {/* <div className="mb-4">
          <label className={`block text-sm font-bold mb-2 text-[#F0F4F8] opacity-35 `}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
            className={`w-full px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D91A]  border-2 border-[#56b2bb] text-[#F0F4F8]  `}
          />
        </div> */}

        <div className='mb-4 flex'>
          <div><label className='block text-sm font-bold mb-2 text-[#F0F4F8] opacity-35'>Date of Birth</label>
          <input
            type="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            aria-label="DateOfBirth"
            className={`w-full px-3 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8]`}
          /></div>

    <div><label className='block mx-3 text-sm font-bold mb-2 text-[#F0F4F8] opacity-35'>Gender</label>
          <select
            type="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            aria-label="Gender"
            className={`w-full mx-3 px-3 py-2 border-2 border-[#56B2BB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56B2BB] bg-[#D9D9D9] bg-opacity-10 text-[#F0F4F8]`}>

            <option className='text-black '>Male</option>
            <option className='text-black'>Female</option>

            </select></div>
          
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg hover:bg-[#1D2233] transition-colors  font-semibold  duration-300 ease-in-out bg-[#56b2bb] border-2 border-[#56b2bb] text-[#f0f4f8] text-xl`}
        >
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;
