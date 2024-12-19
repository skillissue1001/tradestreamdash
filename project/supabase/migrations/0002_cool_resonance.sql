/*
  # Add administrator role

  1. Changes
    - Add `is_admin` column to users table
    - Add function to check if user is admin
    - Update policies to give admins full access
    - Add initial admin users based on email

  2. Security
    - Only admins can modify admin status
    - Admins have full access to all data
*/

-- Add admin column to users table
ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false;

-- Create admin check function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies to give admins full access
ALTER POLICY "Users can read their own data" ON users
USING (auth.uid() = id OR auth.is_admin());

ALTER POLICY "Users can update their own data" ON users
USING (auth.uid() = id OR auth.is_admin());

ALTER POLICY "Users can read tasks they created or are assigned to" ON tasks
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM task_assignees
    WHERE task_id = tasks.id AND user_id = auth.uid()
  ) OR
  auth.is_admin()
);

ALTER POLICY "Users can create tasks" ON tasks
WITH CHECK (created_by = auth.uid() OR auth.is_admin());

ALTER POLICY "Users can update tasks they created or are assigned to" ON tasks
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM task_assignees
    WHERE task_id = tasks.id AND user_id = auth.uid()
  ) OR
  auth.is_admin()
);

ALTER POLICY "Users can delete tasks they created" ON tasks
USING (created_by = auth.uid() OR auth.is_admin());

-- Set initial admin users
DO $$
BEGIN
  -- Replace these email addresses with your actual admin emails
  UPDATE users SET is_admin = true
  WHERE email IN (
    'admin@example.com',
    'admin2@example.com'
  );
END $$;