import React from 'react';
import { BsFillTelephoneFill } from "react-icons/bs";
import bg from '../../Images/ssss.jpg';
import logo from '../../Images/aimture long.png';
import RegisterForm from '../../Components/Common/RegisterForm';

export default function RegisterPage() {
  return (
   
      
      <div 
      className="min-h-screen w-full bg-cover bg-center flex justify-center items-center" 
      style={{ backgroundImage: `url(${bg})` }}
    >
     <div className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-160 h-16" />  {/* Adjust size as needed */}
      </div>
      <div className='absolute top-4 right-4'><button className='text-[#56B2BB] bg-[#56b2bb] bg-opacity-15 border-2 border-[#56b2bb] rounded-lg p-2'><button className='border-2 border-[#56b2bb] rounded-full p-1'><BsFillTelephoneFill /></button> CONTACT_US</button></div>

      <div className="w-full flex  ">
        <div className="w-[500px] p-8 ">
          <RegisterForm/>
        </div>
      </div>
    </div>
  );
}
