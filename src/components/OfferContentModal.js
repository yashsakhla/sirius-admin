// src/components/settings/OfferContentModal.js
import { useState, useRef } from 'react';

export default function OfferContentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    heading: '',
    name: '',
    desc: '',
    code: '',
    image: '',
    imageFile: null,
  });

  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));
  };

  const handleSubmit = () => {
    if (!form.heading || !form.name || !form.desc || !form.code || !form.imageFile) {
      return alert('All fields are required.');
    }

    onSubmit({
      heading: form.heading,
      name: form.name,
      desc: form.desc,
      code: form.code,
      image: form.image,
      imageFile: form.imageFile,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Offer Content</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="heading"
            placeholder="Offer Heading"
            className="w-full border px-3 py-2 rounded"
            value={form.heading}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Offer Name"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            name="desc"
            placeholder="Offer Description"
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={form.desc}
            onChange={handleChange}
          />
          <input
            type="text"
            name="code"
            placeholder="Offer Code"
            className="w-full border px-3 py-2 rounded"
            value={form.code}
            onChange={handleChange}
          />

          <div>
            <label className="block mb-1 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFileChange}
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-32 w-full object-cover mt-2 rounded"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Offer
          </button>
        </div>
      </div>
    </div>
  );
}
