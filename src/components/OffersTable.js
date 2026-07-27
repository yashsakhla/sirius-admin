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
          className="btn-primary"
        >
          + Create Offer
        </button>
      </div>

      {/* Table */}
      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="table-head-row">
            <tr>
              <th className="table-cell">Offer Code</th>
              <th className="table-cell">Name</th>
              <th className="table-cell">Description</th>
              <th className="table-cell">Type</th>
              <th className="table-cell">Value</th>
              <th className="table-cell">Operations</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(offers) && offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer._id} className="table-row">
                  <td className="table-cell font-medium text-gray-900">{offer.code}</td>
                  <td className="table-cell">{offer.name}</td>
                  <td className="table-cell text-gray-600 max-w-xs">
                    <span className="line-clamp-2">{offer.desc}</span>
                  </td>
                  <td className="table-cell">{offer.type}</td>
                  <td className="table-cell">
                    {offer.type === 'Percent'
                      ? `${offer.percent}%`
                      : offer.type === 'Buy X Get Y Free'
                      ? `Buy ${offer.buyQty}, Get ${offer.freeQty}`
                      : 'Free Delivery'}
                  </td>
                  <td className="table-cell">{offer.operationName ?? 'None'}</td>
                  <td className="table-cell">
                    <span className={offer.active ? 'badge-success' : 'badge-danger'}>
                      {offer.active ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggle(offer._id)}
                        className={offer.active ? 'btn-warning btn-sm' : 'btn-success btn-sm'}
                      >
                        {offer.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => onDelete(offer._id)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="table-cell text-center text-gray-500 italic">
                  No offers created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-md">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-gray-900">Create Offer</h2>
            </div>

            <div className="modal-body">
              <input
                type="text"
                placeholder="Offer Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="input-field"
              />

              <input
                type="text"
                placeholder="Offer Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />

              <textarea
                placeholder="Offer Description"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="input-field"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
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
                  className="input-field"
                />
              )}

              {form.type === 'Buy X Get Y Free' && (
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Buy No"
                    value={form.buyQty}
                    onChange={(e) => setForm({ ...form, buyQty: e.target.value })}
                    className="input-field w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Free No"
                    value={form.freeQty}
                    onChange={(e) => setForm({ ...form, freeQty: e.target.value })}
                    className="input-field w-1/2"
                  />
                </div>
              )}

              {/* User Type Dropdown */}
              <div>
                <label className="field-label" htmlFor="userTypeSelect">
                  User Type
                </label>
                <select
                  id="userTypeSelect"
                  value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: e.target.value })}
                  className="input-field mb-3"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>

                {form.userType === 'Premium' && (
                  <>
                    <label className="field-label" htmlFor="premiumApplicabilitySelect">
                      Premium Applicability
                    </label>
                    <select
                      id="premiumApplicabilitySelect"
                      value={form.premiumApplicability}
                      onChange={(e) => setForm({ ...form, premiumApplicability: e.target.value })}
                      className="input-field"
                    >
                      <option value="All">All</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </>
                )}
              </div>

              {/* Operations Dropdown */}
              <div>
                <label className="field-label mt-2" htmlFor="operationsSelect">
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
                  className="input-field"
                >
                  {operationOptions.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOffer}
                className="btn-primary"
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
