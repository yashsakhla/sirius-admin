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
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage promotional offer content shown to customers</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowOfferModal(true)}
        >
          + Add Offer Content
        </button>
      </div>

      {/* List added contents (optional preview) */}
      {offerContents.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 mt-6">
          No offer content yet. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {offerContents.map((offer, idx) => (
            <div key={idx} className="card p-4">
              <img
                src={offer.image}
                className="h-40 w-full object-cover rounded-lg"
                alt="Offer"
              />
              <h2 className="text-lg font-bold mt-3 text-gray-900">{offer.heading}</h2>
              <p className="text-gray-700">{offer.name}</p>
              <p className="text-sm text-gray-500">{offer.desc}</p>
              <p className="text-blue-700 font-medium mt-1">Code: {offer.code}</p>
            </div>
          ))}
        </div>
      )}

      {showOfferModal && (
        <OfferContentModal
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleAddOfferContent}
        />
      )}
    </div>
  );
}
