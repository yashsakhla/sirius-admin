// components/StatusDropdown.js
import { useState } from 'react';

const statuses = ['Ordered', 'Processing', 'Dispatched', 'Delivered'];

export default function StatusDropdown({ current, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className="px-3 py-1 bg-gray-200 rounded"
        onClick={() => setOpen(!open)}
      >
        {current}
      </button>
      {open && (
        <ul className="absolute left-0 mt-1 w-28 bg-white border rounded shadow z-10">
          {statuses.filter(s => s !== current).map(status => (
            <li 
              key={status} 
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => { setOpen(false); onChange(status); }}
            >
              {status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
