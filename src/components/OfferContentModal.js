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
    <div className="modal-overlay">
      <div className="modal-panel max-w-lg">
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-900">Create Offer Content</h2>
        </div>

        <div className="modal-body">
          <input
            type="text"
            name="heading"
            placeholder="Offer Heading"
            className="input-field"
            value={form.heading}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Offer Name"
            className="input-field"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            name="desc"
            placeholder="Offer Description"
            className="input-field"
            rows={3}
            value={form.desc}
            onChange={handleChange}
          />
          <input
            type="text"
            name="code"
            placeholder="Offer Code"
            className="input-field"
            value={form.code}
            onChange={handleChange}
          />

          <div>
            <label className="field-label">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFileChange}
              className="input-field file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-32 w-full object-cover mt-2 rounded-lg border border-gray-200"
              />
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Save Offer
          </button>
        </div>
      </div>
    </div>
  );
}
