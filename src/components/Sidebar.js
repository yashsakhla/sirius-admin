// components/Sidebar.js
import SidebarItem from "./SidebarItem";
import { FaBox, FaUser, FaTags, FaCog, FaSignOutAlt, FaServicestack, FaCode, FaDashcube, FaBell } from "react-icons/fa";
import { logout } from "../api.js";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaDashcube /> },
  { to: '/orders', label: 'Orders', icon: <FaBox /> },
  { to: '/users', label: 'Users', icon: <FaUser /> },
  { to: '/products', label: 'Products', icon: <FaTags /> },
  { to: '/category', label: 'Category', icon: <FaServicestack /> },
  { to: '/offers', label: 'Offers & Coupon', icon: <FaCode /> },
  { to: '/notifications', label: 'Notifications', icon: <FaBell /> },
  { to: '/settings', label: 'Settings', icon: <FaCog /> }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("admin_username");
    const handleLogout = () => {
    logout();         // Clear token and axios
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold shadow-sm shadow-blue-600/30">
          S
        </div>
        <div>
          <div className="text-base font-semibold leading-tight">Sirius Admin</div>
          <div className="text-xs text-gray-400 leading-tight">Control Panel</div>
        </div>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map(item => (
          <SidebarItem key={item.label} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="border-t border-gray-800 px-3 py-4 space-y-3">
        {adminUsername && (
          <div className="px-3 text-xs text-gray-400 truncate">
            Signed in as <span className="text-gray-200 font-medium">{adminUsername}</span>
          </div>
        )}
        <button
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          onClick={() => {handleLogout()}}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
