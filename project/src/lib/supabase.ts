import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const subscribeToTaskChanges = (
  callback: (payload: any) => void,
  errorCallback: (error: Error) => void
) => {
  try {
    const subscription = supabase
      .channel('tasks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    errorCallback(error as Error);
    return () => {};
  }
};