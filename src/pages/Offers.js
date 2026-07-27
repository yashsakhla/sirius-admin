import { useEffect, useState, useCallback } from 'react';
import OffersTable from '../components/OffersTable';
import {
  fetchOffers,
  createOffer,
  updateOffer,
} from '../api';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchOffers();
      const data = res.data;

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
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);


  const handleAddOffer = async (newOffer) => {
    try {
      await createOffer(newOffer);
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

      await updateOffer(offer.code, updated);
      loadOffers();
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Offers</h1>
          <p className="page-subtitle">Create and manage discount codes and promotions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading offers...</div>
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