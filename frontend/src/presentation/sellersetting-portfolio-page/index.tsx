'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaGripVertical, FaPlus } from 'react-icons/fa';
import { FiBookOpen, FiTrash2 } from 'react-icons/fi';

type PortfolioItem = {
  _id: string | number;
  title: string;
  synopsis: string;
};

export default function PortfolioPage() {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    synopsis: '',
    publishMedium: '',
    pdfFile: '',
  });
  const [newItem, setNewItem] = useState({
    title: '',
    synopsis: '',
    publishMedium: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/portfolios`, {
          withCredentials: true,
          validateStatus: (status) => status < 500, // don't throw for 404
        });

        if (res.status === 200) {
          setItems(res.data || []);
        } else if (res.status === 404) {
          console.warn('Portfolio not found (404)');
          setItems([]); // optional: clear items or show fallback UI
        } else {
          console.error('Unexpected response:', res.status, res.data);
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number | string) => {
    setItems(items.filter((item) => item._id !== id));
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE}/portfolios/${id}`, {
      withCredentials: true,
    });
    alert('Portfolio item deleted');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
    setErrors({ ...errors, [name]: '' }); // clear field error
  };

  const limitString = (str: string, limit: number = 100): string => {
    return str.length > limit ? str.slice(0, limit) + '...' : str;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setErrors({ ...errors, pdfFile: 'Only PDF files are allowed.' });
      return;
    }
    setPdfFile(file);
    setErrors({ ...errors, pdfFile: '' });
  };

  const validateForm = () => {
    const newErrors = {
      title: !newItem.title.trim() ? 'Title is required' : '',
      synopsis: !newItem.synopsis.trim() ? 'Synopsis is required' : '',
      publishMedium: !newItem.publishMedium.trim()
        ? 'Publish Medium is required'
        : '',
      pdfFile: !pdfFile ? 'Please upload a PDF file' : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append('title', newItem.title);
      formData.append('synopsis', newItem.synopsis);
      formData.append('publishMedium', newItem.publishMedium);

      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/portfolios`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );


      setItems((prev) => [res.data.article, ...prev]);
      setShowModal(false);
      alert('Portfolio uploaded successfully');
    } catch (error) {
      console.error('Error submitting portfolio items:', error);
      alert('Failed to upload portfolio.');
    }

    setNewItem({
      title: '',
      synopsis: '',
      publishMedium: '',
    });
    setPdfFile(null);
    setErrors({
      title: '',
      synopsis: '',
      publishMedium: '',
      pdfFile: '',
    });
  };

  return (
    <main className="min-h-screen w-full bg-[#f6f2ef] p-8 text-[#1f1f1f]">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <FiBookOpen className="w-6 h-6" />
        Portfolio
      </h1>

      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg mb-4 shadow-inner">
        <span className="font-semibold text-lg">Order</span>
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center w-6 h-6 rounded-full text-xl text-gray-600 hover:text-black"
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative pointer-events-auto border border-gray-300">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                type="text"
                className={`w-full border rounded px-3 py-2 ${
                  errors.title ? 'border-red-500' : ''
                }`}
                value={newItem.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Synopsis</label>
              <input
                name="synopsis"
                type="text"
                className={`w-full border rounded px-3 py-2 ${
                  errors.synopsis ? 'border-red-500' : ''
                }`}
                value={newItem.synopsis}
                onChange={handleInputChange}
              />
              {errors.synopsis && (
                <p className="text-red-500 text-sm mt-1">{errors.synopsis}</p>
              )}
            </div>

            {/* Publish Medium */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Publish Medium
              </label>
              <input
                name="publishMedium"
                type="text"
                className={`w-full border rounded px-3 py-2 ${
                  errors.publishMedium ? 'border-red-500' : ''
                }`}
                value={newItem.publishMedium}
                onChange={handleInputChange}
              />
              {errors.publishMedium && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.publishMedium}
                </p>
              )}
            </div>

            {/* Upload PDF */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />
              {pdfFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Uploaded: <span className="font-medium">{pdfFile.name}</span>
                </p>
              )}
              {errors.pdfFile && (
                <p className="text-red-500 text-sm mt-1">{errors.pdfFile}</p>
              )}
            </div>

            {/* Confirm Button */}
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 w-full font-semibold"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <hr className="border-t border-gray-400 mb-6" />

      {/* Portfolio List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-md px-4 py-3 flex gap-4 items-start"
          >
            <div className="pt-1">
              <FaGripVertical className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-base mb-1">{item.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {limitString(item.synopsis, 100)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="text-gray-500 hover:text-red-600"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
