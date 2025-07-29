import { useState } from 'react';

export default function OffersTable({ offers, onAdd, onToggle, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  // Add operations to form state: selected name and id
  const [form, setForm] = useState({
    code: '',
    name: '',
    desc: '',
    type: 'Free Delivery',
    percent: '',
    buyQty: '',
    freeQty: '',
    userType: 'Standard',
    premiumApplicability: 'All',
    operationName: 'None',
    operationId: 0,
  });

  // List of operation options
  const operationOptions = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Convert Into Member' },
  ];

  const handleAddOffer = () => {
    if (!form.code || !form.name || !form.desc) {
      alert("Fill all required fields");
      return;
    }

    let value = '';
    if (form.type === 'Percent') {
      if (!form.percent) return alert("Enter percentage off");
      value = form.percent + "%";
    } else if (form.type === 'Buy X Get Y Free') {
      if (!form.buyQty || !form.freeQty) return alert("Enter buy/free quantities");
      value = `Buy ${form.buyQty} Get ${form.freeQty}`;
    }

    const newOffer = {
      code: form.code,
      name: form.name,
      desc: form.desc,
      type: form.type,
      value: form.type === 'Free Delivery' ? '—' : value,
      percent: form.percent,
      userType: form.userType,
      ...(form.userType === 'Premium' ? { premiumApplicability: form.premiumApplicability } : {}),
      operationId: form.operationId,    // Include selected operation's ID in payload
      operationName: form.operationName,
    };

    onAdd(newOffer);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      desc: '',
      type: 'Free Delivery',
      percent: '',
      buyQty: '',
      freeQty: '',
      userType: 'Standard',
      premiumApplicability: 'All',
      operationName: 'None',
      operationId: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Create Offer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Offer Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">Operations</th> {/* New header */}
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(offers) && offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer._id} className="border-t">
                  <td className="px-4 py-2">{offer.code}</td>
                  <td className="px-4 py-2">{offer.name}</td>
                  <td className="px-4 py-2">{offer.desc}</td>
                  <td className="px-4 py-2">{offer.type}</td>
                  <td className="px-4 py-2">
                    {offer.type === 'Percent'
                      ? `${offer.percent}%`
                      : offer.type === 'Buy X Get Y Free'
                      ? `Buy ${offer.buyQty}, Get ${offer.freeQty}`
                      : 'Free Delivery'}
                  </td>
                  <td className="px-4 py-2">{offer.operationName ?? 'None'}</td> {/* Show operation name */}
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        offer.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {offer.active ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => onToggle(offer._id)}
                      className={`text-xs px-3 py-1 rounded ${
                        offer.active
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {offer.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => onDelete(offer._id)}
                      className="text-xs px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500 italic">
                  No offers created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Create Offer</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Offer Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Offer Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Offer Description"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Free Delivery">Free Delivery</option>
                <option value="Percent">Product Off</option>
                <option value="Buy X Get Y Free">Buy & Get Free</option>
              </select>

              {form.type === 'Percent' && (
                <input
                  type="number"
                  placeholder="Offer % Off"
                  value={form.percent}
                  onChange={(e) => setForm({ ...form, percent: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              )}

              {form.type === 'Buy X Get Y Free' && (
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Buy No"
                    value={form.buyQty}
                    onChange={(e) => setForm({ ...form, buyQty: e.target.value })}
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Free No"
                    value={form.freeQty}
                    onChange={(e) => setForm({ ...form, freeQty: e.target.value })}
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                </div>
              )}

              {/* User Type Dropdown */}
              <div>
                <label className="block font-semibold mb-1" htmlFor="userTypeSelect">
                  User Type
                </label>
                <select
                  id="userTypeSelect"
                  value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: e.target.value })}
                  className="w-full border px-3 py-2 rounded mb-3"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>

                {form.userType === 'Premium' && (
                  <>
                    <label className="block font-semibold mb-1" htmlFor="premiumApplicabilitySelect">
                      Premium Applicability
                    </label>
                    <select
                      id="premiumApplicabilitySelect"
                      value={form.premiumApplicability}
                      onChange={(e) => setForm({ ...form, premiumApplicability: e.target.value })}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="All">All</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </>
                )}
              </div>

              {/* Operations Dropdown */}
              <div>
                <label className="block font-semibold mb-1 mt-4" htmlFor="operationsSelect">
                  Operations
                </label>
                <select
                  id="operationsSelect"
                  value={form.operationId}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selectedOption = operationOptions.find(opt => opt.id === selectedId);
                    setForm({ 
                      ...form, 
                      operationId: selectedId,
                      operationName: selectedOption ? selectedOption.name : 'None'
                    });
                  }}
                  className="w-full border px-3 py-2 rounded"
                >
                  {operationOptions.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOffer}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
