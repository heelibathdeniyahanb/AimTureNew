import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";

export const sendEmail = async ({ recipients, subject, body, attachments = [] }) => {
  const formData = new FormData();
  recipients.forEach(email => formData.append("recipients", email)); // Append array items
  formData.append("subject", subject);
  formData.append("body", body);
  attachments.forEach(file => formData.append("attachments", file)); // Optional

  return await axios.post(`${API_BASE_URL}/Email`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

