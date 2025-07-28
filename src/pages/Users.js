// src/pages/Users.js
import { useEffect, useState } from 'react';
import UsersTable from '../components/UsersTable';
import { getAllUsers, setAuthToken } from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);

    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error('❌ Failed to load users:', err.message);
        alert('Error loading users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
