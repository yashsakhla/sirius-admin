// src/pages/Settings.js
import { useState } from 'react';
import OfferContentModal from '../components/OfferContentModal';

export default function Settings() {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerContents, setOfferContents] = useState([]);

  const handleAddOfferContent = (newContent) => {
    setOfferContents((prev) => [...prev, newContent]);
    setShowOfferModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowOfferModal(true)}
        >
          + Add Offer Content
        </button>
      </div>

      {/* List added contents (optional preview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {offerContents.map((offer, idx) => (
          <div key={idx} className="border rounded shadow p-4">
            <img
              src={offer.image}
              className="h-40 w-full object-cover rounded"
              alt="Offer"
            />
            <h2 className="text-lg font-bold mt-2">{offer.heading}</h2>
            <p>{offer.name}</p>
            <p className="text-sm text-gray-600">{offer.desc}</p>
            <p className="text-blue-700 font-medium">Code: {offer.code}</p>
          </div>
        ))}
      </div>

      {showOfferModal && (
        <OfferContentModal
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleAddOfferContent}
        />
      )}
    </div>
  );
}
