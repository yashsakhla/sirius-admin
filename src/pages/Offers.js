import { useEffect, useState } from 'react';
import OffersTable from '../components/OffersTable';
import {
  fetchOffers,
  createOffer,
  updateOffer,
} from '../api';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Load offers on first mount
  useEffect(() => {
    loadOffers();
  }, []);
const loadOffers = async () => {
  setLoading(true);
  try {
    const res = await fetchOffers();
    const data = res.data;
    console.log("Fetched offers from API:", data); // 👈 Confirm what you're getting

    if (Array.isArray(data)) {
      setOffers(data);
    } else {
      console.warn('Unexpected offers response:', data);
      setOffers([]);
    }
  } catch (err) {
    console.error('Failed to fetch offers', err);
    setOffers([]);
  } finally {
    setLoading(false);
  }
};



  const handleAddOffer = async (newOffer) => {
    try {
      const created = await createOffer(newOffer);
      loadOffers();
    } catch (err) {
      console.error('Create offer failed', err);
      alert('Failed to create offer 🥲');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const offer = offers.find((o) => o._id === id);
      const updated = {
        ...offer,
        active: !offer.active,
      };

      const data = await updateOffer(offer.code, updated);

     loadOffers()
    } catch (err) {
      console.error('Failed to update offer', err);
      alert('Could not update status');
    }
  };

  const handleDeleteOffer = (id) => {
    // You can implement backend deletion later if needed
    setOffers(offers.filter((o) => o._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Offers</h1>
      </div>

      {loading ? (
        <div>Loading offers...</div>
      ) : (
        <OffersTable
          offers={offers}
          onAdd={handleAddOffer}
          onToggle={handleToggleStatus}
          onDelete={handleDeleteOffer}
        />
      )}
    </div>
  );
}