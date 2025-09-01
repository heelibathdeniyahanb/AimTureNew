// ContentPreview.jsx
import React, { useState } from "react";
import { FaFile, FaDownload, FaEye } from "react-icons/fa";

const ContentPreview = ({ content }) => {
  const [pdfDisplayMethod, setPdfDisplayMethod] = useState("direct");

  const getFileType = (url) => {
    const ext = url?.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
    if (["mp4", "mov", "webm"].includes(ext)) return "video";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx", "txt"].includes(ext)) return "document";
    if (["ppt", "pptx"].includes(ext)) return "presentation";
    return "other";
  };

  const getFileExtension = (url) => "." + url.split(".").pop();

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (!content?.url) {
    return (
      <div className="text-center p-8 text-gray-400">
        <FaFile size={48} className="mx-auto mb-4" />
        <p>No file attached</p>
      </div>
    );
  }

  const fileType = getFileType(content.url);
  const extension = getFileExtension(content.url);

  switch (fileType) {
    case "image":
      return <img src={content.url} alt={content.title} className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg" />;
    case "video":
      return (
        <video controls className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg">
          <source src={content.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    case "pdf":
      return (
        <div>
          <img src={content.url.replace("/upload/", "/upload/w_600/f_auto,q_auto/pg_1.jpg/")} alt="PDF preview" className="mb-4 rounded-lg shadow-lg" />
          <div className="flex gap-3 justify-center flex-wrap mb-4">
            <button
              onClick={() => setPdfDisplayMethod("direct")}
              className={`px-3 py-1 rounded ${pdfDisplayMethod === "direct" ? "bg-blue-600" : "bg-gray-600"} text-white text-sm`}
            >
              View Inline
            </button>
            <button
              onClick={() => window.open(content.url, "_blank")}
              className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <FaDownload size={12} /> Download
            </button>
          </div>
          {pdfDisplayMethod === "direct" && <iframe src={content.url} className="w-full h-[500px] border border-gray-600 rounded-lg" title={content.title} />}
        </div>
      );
    case "document":
    case "presentation":
      return (
        <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
          <FaFile size={64} className="mx-auto mb-4 text-blue-400" />
          <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
          <p className="text-gray-400 mb-4">{fileType === "document" ? "Word Document" : "PowerPoint Presentation"}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.open(content.url, "_blank")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaEye /> View
            </button>
            <button
              onClick={() => downloadFile(content.url, content.title + extension)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>
      );
    default:
      return <p>Unsupported file type</p>;
  }
};

export default ContentPreview;
