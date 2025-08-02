import React, { useEffect, useState } from 'react';
import { fetchPagedAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement } from '../Apis/AdvertisementsApi';
import { AdvertisementProviderAPI } from '../Apis/ServiceProviderApi';
import { SpecificationAPI } from '../Apis/SpecificationApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAdvertisementModal from './EditAdvertisements';

export default function Advertisements() {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [editAd, setEditAd] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ Dropdown states
  const [providers, setProviders] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);

  // ✅ Simulate logged-in user ID (replace with your auth context)
  const loggedUserId = 1;

  useEffect(() => {
    loadAds();
  }, [page, searchTerm]);

  // ✅ Load Providers & Specifications on first render
  useEffect(() => {
    loadProviders();
    loadSpecifications();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await AdvertisementProviderAPI.getAll();
      setProviders(data);
    } catch (error) {
      console.error("Failed to load providers:", error);
    }
  };

  const loadSpecifications = async () => {
    try {
      const data = await SpecificationAPI.getAll();
      setSpecifications(data);
    } catch (error) {
      console.error("Failed to load specifications:", error);
    }
  };

  const loadAds = async () => {
    const result = await fetchPagedAdvertisements(page, pageSize, searchTerm);
    if (result) {
      setAds(result.data);
      setTotalCount(result.totalCount);
    }
  };

  const handleCreateAd = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ title: '', description: '' });
    setFile(null);
    setSelectedProvider('');
    setSelectedSpecifications([]);
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !file || !selectedProvider) {
      toast.error('Title, Image, and Provider are required');
      return;
    }

    const payload = new FormData();
    payload.append('Title', formData.title);
    payload.append('Description', formData.description);
    payload.append('Image', file);
    payload.append('AdvertisementProviderId', selectedProvider);
    payload.append('CreatedUserId', loggedUserId); // ✅ Automatically set logged user
    selectedSpecifications.forEach((id) => payload.append('SpecificationIds', id));

    const result = await createAdvertisement(payload);
    if (result) {
      toast.success('Advertisement created!');
      handleCloseModal();
      loadAds();
    } else {
      toast.error('Failed to create advertisement.');
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    const success = await deleteAdvertisement(id);
    if (success) {
      toast.success('Advertisement deleted');
      loadAds();
    } else {
      toast.error('Failed to delete advertisement');
    }
  };

  return (
    <div className="p-6 bg-[#1e1e1e] min-h-screen text-[#f0f4f8]">
      <ToastContainer />

      {/* 🔍 Search + Add */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="bg-[#19191a] text-white border border-[#767676] rounded p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#56b2bb]"
        />
        <button onClick={handleCreateAd} className="ml-4 bg-[#56b2bb] text-white px-4 py-2 rounded-lg shadow hover:bg-[#469aa2]">
          + Advertisement
        </button>
      </div>

      {/* 🟢 Ads Grid */}
      {ads.length === 0 ? (
        <p className="text-[#767676]">No advertisements available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-[#19191a] rounded-2xl shadow p-4 hover:shadow-xl transform hover:scale-[1.02] transition border border-[#767676]/40">
              <h2 className="text-lg font-semibold text-white">{ad.title}</h2>
              <p className="text-[#d9d9d9] mt-1">{ad.description}</p>
              {ad.imageUrl && (
                <img src={ad.imageUrl} alt="Ad" onClick={() => setPreviewImageUrl(ad.imageUrl)} className="mt-3 w-full h-40 object-cover rounded cursor-pointer hover:opacity-90" />
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setEditAd(ad)} className="text-sm text-[#56b2bb] hover:underline">Edit</button>
                <button onClick={() => handleDeleteAd(ad.id)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔄 Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 bg-[#767676] text-white rounded disabled:opacity-50">Prev</button>
        <span className="text-white">Page {page} of {Math.ceil(totalCount / pageSize)}</span>
        <button disabled={page * pageSize >= totalCount} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-[#767676] text-white rounded disabled:opacity-50">Next</button>
      </div>

      {/* 🖼️ Image Preview */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="relative bg-[#1e1e1e] p-4 rounded shadow-lg">
            <img src={previewImageUrl} alt="Preview" className="max-w-[90vw] max-h-[80vh] object-contain rounded" />
            <button onClick={() => setPreviewImageUrl(null)} className="absolute top-2 right-2 bg-[#767676] text-white px-3 py-1 rounded hover:bg-[#5f5f5f]">✕</button>
          </div>
        </div>
      )}

      {/* 🟢 Create Advertisement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md border border-[#767676]">
            <h2 className="text-xl font-bold mb-4 text-white">Create Advertisement</h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2" />

              <label className="block text-sm mt-3">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2" />

              <label className="block text-sm mt-3">Image</label>
              <input type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="mt-1 w-full text-white" />

              {/* Provider Dropdown */}
              <label className="block text-sm mt-3">Advertisement Provider</label>
              <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} required className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2">
                <option value="">-- Select Provider --</option>
                {providers.map((p) => <option key={p.id} value={p.id}>{p.fullName} - {p.instituteName}</option>)}
              </select>

              {/* Multi-select Specifications */}
              <label className="block text-sm mt-3">Specifications</label>
              <select multiple value={selectedSpecifications} onChange={(e) => setSelectedSpecifications(Array.from(e.target.selectedOptions, opt => opt.value))} className="mt-1 w-full bg-[#19191a] text-white border border-[#767676] rounded p-2">
                {specifications.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={handleCloseModal} className="bg-[#767676] text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-[#56b2bb] text-white px-4 py-2 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editAd && (
        <EditAdvertisementModal
          ad={editAd}
          onClose={() => setEditAd(null)}
          onUpdated={(updatedAd) => {
            setAds((prev) => prev.map((item) => (item.id === updatedAd.id ? updatedAd : item)));
            setEditAd(null);
          }}
        />
      )}
    </div>
  );
}
