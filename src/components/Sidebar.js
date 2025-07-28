// components/Sidebar.js
import SidebarItem from "./SidebarItem";
import { FaBox, FaUser, FaTags, FaCog, FaSignOutAlt, FaServicestack, FaCode, FaDashcube } from "react-icons/fa";

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaDashcube /> },
  { to: '/orders', label: 'Orders', icon: <FaBox /> },
  { to: '/users', label: 'Users', icon: <FaUser /> },
  { to: '/products', label: 'Products', icon: <FaTags /> },
  { to: '/category', label: 'Category', icon: <FaServicestack /> },
  { to: '/offers', label: 'Offers & Coupon', icon: <FaCode /> },
  { to: '/settings', label: 'Settings', icon: <FaCog /> }
];

export default function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">Admin Panel</div>
      <nav className="flex-1 mt-4">
        {navItems.map(item => (
          <SidebarItem key={item.label} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>
      <button className="flex items-center mx-6 my-4 p-2 rounded hover:bg-gray-700 transition" onClick={() => {/* Handle logout */}}>
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </aside>
  );
}
