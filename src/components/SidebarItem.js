// components/SidebarItem.js
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-6 py-2.5 hover:bg-gray-700 rounded transition ${isActive ? 'bg-gray-900' : ''}`
      }
    >
      {icon}
      <span className="ml-4">{label}</span>
    </NavLink>
  );
}
