import React, { useState } from "react";
import { sendResetCode, verifyResetCode, resetPassword } from ".././../Apis/UserApi";
import { toast } from "react-toastify";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    try {
      await sendResetCode(email);
      toast.success("Reset code sent to your email");
      setStep(2);
    } catch (error) {
      toast.error("Error sending code");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyResetCode(email, code);
      toast.success("Code verified!");
      setStep(3);
    } catch (error) {
      toast.error("Invalid or expired code");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email, code, newPassword);
      toast.success("Password reset successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send Reset Code
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Verify Code
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-500 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
