import React, { useEffect, useState } from "react";
import { FaChartBar, FaFileAlt, FaEye, FaThumbsUp, FaTimes, FaDownload, FaFilePdf, FaImage, FaVideo, FaFile } from "react-icons/fa";
import { getAllContents } from "../Apis/ContentApi";

export default function CDashboardComponent() {
  const [contents, setContents] = useState([]);
  const [totalContents, setTotalContents] = useState(0);
  const [selectedContent, setSelectedContent] = useState(null);
  const [pdfDisplayMethod, setPdfDisplayMethod] = useState('pdfjs'); // 'direct', 'pdfjs', 'download'

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getAllContents();
        setContents(data);
        setTotalContents(data.length);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };
    fetchContents();
  }, []);

  const recentContents = [...contents].reverse().slice(0, 5);

  // Get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return "";
    const path = new URL(url).pathname;
    return path.substring(path.lastIndexOf('.')).toLowerCase();
  };

  // Get file type from URL
  const getFileType = (url) => {
    const ext = getFileExtension(url);
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'image';
    if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) return 'video';
    if (ext === '.pdf') return 'pdf';
    if (['.docx', '.doc'].includes(ext)) return 'document';
    if (['.pptx', '.ppt'].includes(ext)) return 'presentation';
    return 'file';
  };

  // Download file function
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  // Render content based on type
//   const renderContentPreview = (content) => {
//     if (!content.url) {
//       return (
//         <div className="text-center p-8 text-gray-400">
//           <FaFile size={48} className="mx-auto mb-4" />
//           <p>No file attached</p>
//         </div>
//       );
//     }

//     const fileType = getFileType(content.url);
//     const extension = getFileExtension(content.url);

//     switch (fileType) {
//       case 'image':
//         return (
//           <div className="text-center">
//             <img
//               src={content.url}
//               alt={content.title}
//               className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg"
//               onError={(e) => {
//                 e.target.style.display = 'none';
//                 e.target.nextSibling.style.display = 'block';
//               }}
//             />
//             <div style={{ display: 'none' }} className="text-center p-8 text-red-400">
//               <p>Failed to load image</p>
//               <button
//                 onClick={() => downloadFile(content.url, content.title + extension)}
//                 className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
//               >
//                 <FaDownload /> Download
//               </button>
//             </div>
//           </div>
//         );

//       case 'video':
//         return (
//           <div className="text-center">
//             <video
//               controls
//               className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg"
//               onError={(e) => {
//                 e.target.style.display = 'none';
//                 e.target.nextSibling.style.display = 'block';
//               }}
//             >
//               <source src={content.url} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div style={{ display: 'none' }} className="text-center p-8 text-red-400">
//               <p>Failed to load video</p>
//               <button
//                 onClick={() => downloadFile(content.url, content.title + extension)}
//                 className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
//               >
//                 <FaDownload /> Download
//               </button>
//             </div>
//           </div>
//         );

//     //   case 'pdf':
//     //     return (
//     //       <div>
//     //         {/* PDF Display Options */}
//     //         <div className="mb-4 flex gap-2 justify-center flex-wrap">
//     //           <button
//     //             onClick={() => setPdfDisplayMethod('pdfjs')}
//     //             className={`px-3 py-1 rounded ${pdfDisplayMethod === 'pdfjs' ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm`}
//     //           >
//     //             PDF Viewer
//     //           </button>
//     //           <button
//     //             onClick={() => setPdfDisplayMethod('direct')}
//     //             className={`px-3 py-1 rounded ${pdfDisplayMethod === 'direct' ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm`}
//     //           >
//     //             Direct View
//     //           </button>
//     //           <button
//     //             onClick={() => downloadFile(content.url, content.title + '.pdf')}
//     //             className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1"
//     //           >
//     //             <FaDownload size={12} /> Download
//     //           </button>
//     //         </div>

//     //         {/* PDF Display */}
//     //         {pdfDisplayMethod === 'pdfjs' && (
//     //           <iframe
//     //             src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(content.url)}`}
//     //             className="w-full h-[500px] border border-gray-600 rounded-lg"
//     //             title={`${content.title} - PDF Viewer`}
//     //             onError={() => {
//     //               console.log('PDF.js failed, switching to direct view');
//     //               setPdfDisplayMethod('direct');
//     //             }}
//     //           />
//     //         )}

//     //         {pdfDisplayMethod === 'direct' && (
//     //           <div>
//     //             <iframe
//     //               src={content.url}
//     //               className="w-full h-[500px] border border-gray-600 rounded-lg"
//     //               title={content.title}
//     //               onError={() => {
//     //                 console.log('Direct view failed');
//     //                 setPdfDisplayMethod('download');
//     //               }}
//     //             />
//     //           </div>
//     //         )}

//     //         {pdfDisplayMethod === 'download' && (
//     //           <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
//     //             <FaFilePdf size={64} className="mx-auto mb-4 text-red-400" />
//     //             <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
//     //             <p className="text-gray-400 mb-4">PDF cannot be displayed in browser</p>
//     //             <button
//     //               onClick={() => downloadFile(content.url, content.title + '.pdf')}
//     //               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
//     //             >
//     //               <FaDownload /> Download PDF
//     //             </button>
//     //             <button
//     //               onClick={() => window.open(content.url, '_blank')}
//     //               className="ml-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2 mx-auto mt-2"
//     //             >
//     //               <FaEye /> Open in New Tab
//     //             </button>
//     //           </div>
//     //         )}
//     //       </div>
//     //     );
// case 'pdf':
//   return (
//     <div>
//       <div className="mb-4 flex gap-2 justify-center flex-wrap">
//         <button
//           onClick={() => setPdfDisplayMethod('direct')}
//           className={`px-3 py-1 rounded ${pdfDisplayMethod === 'direct' ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm`}
//         >
//           Direct View
//         </button>
//         <button
//           onClick={() => window.open(content.url, '_blank')}
//           className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1"
//         >
//           <FaDownload size={12} /> Download
//         </button>
//       </div>

//       {pdfDisplayMethod === 'direct' && (
//         <iframe
//           src={content.url}
//           className="w-full h-[500px] border border-gray-600 rounded-lg"
//           title={content.title}
//         />
//       )}
//     </div>
//   );

//       case 'document':
//       case 'presentation':
//         return (
//           <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
//             <FaFileAlt size={64} className="mx-auto mb-4 text-blue-400" />
//             <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
//             <p className="text-gray-400 mb-4">
//               {fileType === 'document' ? 'Word Document' : 'PowerPoint Presentation'}
//             </p>
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={() => window.open(content.url, '_blank')}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
//               >
//                 <FaEye /> View
//               </button>
//               <button
//                 onClick={() => downloadFile(content.url, content.title + extension)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//               >
//                 <FaDownload /> Download
//               </button>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
//             <FaFile size={64} className="mx-auto mb-4 text-gray-400" />
//             <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
//             <button
//               onClick={() => downloadFile(content.url, content.title + extension)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
//             >
//               <FaDownload /> Download
//             </button>
//           </div>
//         );
//     }
//   };

// Render content based on type
const renderContentPreview = (content) => {
  if (!content.url) {
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
    case 'image':
      return (
        <div className="text-center">
          <img
            src={content.url}
            alt={content.title}
            className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }} className="text-center p-8 text-red-400">
            <p>Failed to load image</p>
            <button
              onClick={() => downloadFile(content.url, content.title + extension)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="text-center">
          <video
            controls
            className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          >
            <source src={content.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={{ display: 'none' }} className="text-center p-8 text-red-400">
            <p>Failed to load video</p>
            <button
              onClick={() => downloadFile(content.url, content.title + extension)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>
      );

    case 'pdf': {
      // Generate a Cloudinary preview image (first page thumbnail)
      const previewUrl = content.url.replace(
        '/upload/',
        '/upload/w_600/f_auto,q_auto/pg_1.jpg/'
      );

      return (
        <div className="text-center">
          {/* PDF Thumbnail */}
          <img
            src={previewUrl}
            alt={`${content.title} preview`}
            className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-lg mb-4"
            onError={(e) => (e.target.style.display = 'none')}
          />

          {/* PDF Actions */}
          <div className="flex gap-3 justify-center flex-wrap mb-4">
            <button
              onClick={() => setPdfDisplayMethod('direct')}
              className={`px-3 py-1 rounded ${pdfDisplayMethod === 'direct' ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm`}
            >
              View Inline
            </button>
            <button
              onClick={() => window.open(content.url, '_blank')}
              className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <FaDownload size={12} /> Download
            </button>
          </div>

          {pdfDisplayMethod === 'direct' && (
            <iframe
              src={content.url}
              className="w-full h-[500px] border border-gray-600 rounded-lg"
              title={content.title}
            />
          )}
        </div>
      );
    }

    case 'document':
    case 'presentation':
      return (
        <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
          <FaFileAlt size={64} className="mx-auto mb-4 text-blue-400" />
          <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
          <p className="text-gray-400 mb-4">
            {fileType === 'document' ? 'Word Document' : 'PowerPoint Presentation'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.open(content.url, '_blank')}
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
      return (
        <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
          <FaFile size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
          <button
            onClick={() => downloadFile(content.url, content.title + extension)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <FaDownload /> Download
          </button>
        </div>
      );
  }
};


  return (
    <div className="p-6 bg-[#1e1e1e] min-h-screen text-[#f0f4f8]">
      <h1 className="text-3xl font-bold mb-6 text-[#56B2BB]">Dashboard</h1>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#292929] p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-105 transition">
          <FaFileAlt className="text-3xl text-[#56B2BB]" />
          <div>
            <h2 className="text-lg">Total Contents</h2>
            <p className="text-2xl font-bold">{totalContents}</p>
          </div>
        </div>
        <div className="bg-[#292929] p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-105 transition">
          <FaEye className="text-3xl text-[#56B2BB]" />
          <div>
            <h2 className="text-lg">Total Views</h2>
            <p className="text-2xl font-bold">15,430</p>
          </div>
        </div>
        <div className="bg-[#292929] p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-105 transition">
          <FaThumbsUp className="text-3xl text-[#56B2BB]" />
          <div>
            <h2 className="text-lg">Total Likes</h2>
            <p className="text-2xl font-bold">3,210</p>
          </div>
        </div>
        <div className="bg-[#292929] p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-105 transition">
          <FaChartBar className="text-3xl text-[#56B2BB]" />
          <div>
            <h2 className="text-lg">Engagement</h2>
            <p className="text-2xl font-bold">78%</p>
          </div>
        </div>
      </div>

      {/* Recent Contents */}
      <div className="bg-[#292929] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#56B2BB]">Recent Contents</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentContents.map((content) => (
              <tr key={content.id} className="hover:bg-[#1e1e1e]">
                <td className="p-3">{content.title}</td>
                <td className="p-3">{content.description}</td>
                <td className="p-3">{content.specializationNames.join(", ")}</td>
                <td className="p-3">{content.contentTypeName}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedContent(content)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <FaEye size={12} /> View
                    </button>
                    {content.url && (
                      <button
                        onClick={() => downloadFile(content.url, content.title + getFileExtension(content.url))}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        <FaDownload size={12} /> Download
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {recentContents.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-gray-400 text-center">
                  No contents available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Modal for content preview */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#292929] rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-[#f0f4f8] hover:text-red-400 z-10"
              onClick={() => setSelectedContent(null)}
            >
              <FaTimes size={24} />
            </button>
            
            <div className="mb-4 pr-10">
              <h2 className="text-2xl font-bold text-[#56B2BB] mb-2">
                {selectedContent.title}
              </h2>
              <p className="text-gray-300 mb-4">{selectedContent.description}</p>
              
              {/* File info */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>Type: {getFileType(selectedContent.url).toUpperCase()}</span>
                <span>File: {getFileExtension(selectedContent.url)}</span>
                <button
                  onClick={() => downloadFile(selectedContent.url, selectedContent.title + getFileExtension(selectedContent.url))}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <FaDownload size={12} /> Download
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              {renderContentPreview(selectedContent)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}