import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { sendEmail } from "../../Components/Apis/EmailApi";

import Header from "../../Components/User/Header";
import MarketingSidebar from "../../Components/MarketingManager/MarketingManagerSidebar";

const MMEmail = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleAttachmentChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleSend = async () => {
    const recipientList = recipients.split(",").map(email => email.trim()).filter(Boolean);

    if (!recipientList.length || !subject || !body) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await sendEmail({
        recipients: recipientList,
        subject,
        body,
        attachments
      });
      toast.success("Email sent successfully");
      setRecipients("");
      setSubject("");
      setBody("");
      setAttachments([]);
    } catch (error) {
      toast.error("Error sending email: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex text-white">
       <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
            <MarketingSidebar/>      </div>
      <div className="flex-grow ml-[260px]">
        <Header />
        <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-bold text-white mb-6">Compose Email</h2>

          {/* Recipients */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">To (comma-separated):</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="example@email.com, other@example.com"
              className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded focus:ring-2 focus:ring-orange-400 text-white"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded focus:ring-2 focus:ring-orange-400 text-white"
            />
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Message:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded focus:ring-2 focus:ring-orange-400 text-white resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-1">Attachments (optional):</label>
            <input
              type="file"
              multiple
              onChange={handleAttachmentChange}
              className="text-white"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-2 rounded shadow-md"
          >
            Send Email
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default MMEmail;
