/*
  # Add specific admin users
  
  1. Changes
    - Set admin status for specific users by email
*/

DO $$
BEGIN
  UPDATE users SET is_admin = true
  WHERE email IN (
    'kobejanssens@outlook.com',
    'godcomplex182@gmail.com'
  );
END $$;