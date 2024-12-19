import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';
import { Shield, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export function AdminPanel() {
  const { isAdmin, setUserAsAdmin } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, is_admin')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h2>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.full_name || user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => setUserAsAdmin(user.id, !user.is_admin)}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                user.is_admin
                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                  : 'text-green-700 bg-green-100 hover:bg-green-200'
              }`}
            >
              {user.is_admin ? (
                <>
                  <UserX className="h-4 w-4 mr-1" />
                  Remove Admin
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Make Admin
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}