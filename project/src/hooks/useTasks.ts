import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';
import { subscribeToTaskChanges } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    
    // Subscribe to real-time changes
    const unsubscribe = subscribeToTaskChanges(
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(task => 
            task.id === payload.new.id ? payload.new : task
          ));
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(task => task.id !== payload.old.id));
        }
      },
      (error) => {
        console.error('Error in real-time subscription:', error);
        toast.error('Failed to subscribe to real-time updates');
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_assignees (
            user_id,
            users (
              id,
              full_name,
              avatar_url
            )
          ),
          task_comments (
            id,
            content,
            created_at,
            users (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      toast.success('Task created successfully');
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
  };
}