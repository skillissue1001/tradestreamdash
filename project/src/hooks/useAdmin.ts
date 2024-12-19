import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin ?? false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Failed to check admin status');
    } finally {
      setLoading(false);
    }
  };

  const setUserAsAdmin = async (userId: string, adminStatus: boolean) => {
    if (!isAdmin) {
      toast.error('Only administrators can modify admin status');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: adminStatus })
        .eq('id', userId);

      if (error) throw error;
      toast.success(`User ${adminStatus ? 'promoted to' : 'removed from'} admin`);
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  return {
    isAdmin,
    loading,
    setUserAsAdmin,
  };
}