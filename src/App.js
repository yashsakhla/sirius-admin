// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; // ✅ new login page
import PrivateRoute from './components/PrivateRoute'; // ✅ private route guard
import {GlobalDataProvider} from './context/GlobalDataContext'
import './index.css';

function App() {
  return (
    <GlobalDataProvider>
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Nested Admin Routes */}
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="category" element={<Category />} />
          <Route path="offers" element={<Offers />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </GlobalDataProvider>
  );
}

export default App;
