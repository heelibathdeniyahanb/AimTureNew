import React, { useState } from 'react';
import { updateAdvertisement } from '../Apis/AdvertisementsApi';
import { toast } from 'react-toastify';

export default function EditAdvertisementModal({ ad, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: ad.title,
    description: ad.description,
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('Title', formData.title);
    payload.append('Description', formData.description);

    // ✅ Only add file if a new one was chosen
    if (file) {
      payload.append('Image', file);
    }

    const success = await updateAdvertisement(ad.id, payload);
    if (success) {
      toast.success('Advertisement updated');

       // Send updated ad back to parent
    const updatedAd = {
      ...ad,
      ...formData,
      imageUrl: file ? URL.createObjectURL(file) : ad.imageUrl,
    };
    
      onUpdated();
      onClose();
    } else {
      toast.error('Update failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md border border-[#767676]">
        <h2 className="text-xl font-bold mb-4 text-[#ffffff]">Edit Advertisement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-[#f0f4f8]">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2 focus:ring-[#56b2bb]"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-[#f0f4f8]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2 focus:ring-[#56b2bb]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-[#f0f4f8]">Image (optional)</label>
            <div className="flex items-center gap-4 mt-1">
              {ad.imageUrl && (
                <img
                  src={ad.imageUrl}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded border border-[#767676]"
                />
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="text-white file:bg-[#56b2bb] file:text-white file:rounded file:px-4 file:py-2"
              />
            </div>
            <p className="text-xs text-[#767676] mt-1">
              Leave file input empty to keep the current image.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#767676] text-white px-4 py-2 rounded hover:bg-[#5f5f5f]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#56b2bb] text-white px-4 py-2 rounded hover:bg-[#469aa2]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
