/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `last_seen` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `due_date` (timestamp)
      - `progress` (integer)
      - `tags` (text[])
      - `created_by` (uuid, references users)
      - `last_updated` (timestamp)

    - `task_assignees`
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references users)
      - `assigned_at` (timestamp)

    - `task_comments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  due_date timestamptz NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES users(id) NOT NULL,
  last_updated timestamptz DEFAULT now()
);

CREATE TABLE task_assignees (
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read tasks they created or are assigned to"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_assignees
      WHERE task_id = tasks.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks they created or are assigned to"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_assignees
      WHERE task_id = tasks.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks they created"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can read task assignments"
  ON task_assignees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_assignees.task_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM task_assignees ta
          WHERE ta.task_id = tasks.id AND ta.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage task assignments for their tasks"
  ON task_assignees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_assignees.task_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can read comments on tasks they have access to"
  ON task_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_comments.task_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM task_assignees
          WHERE task_id = tasks.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create comments on tasks they have access to"
  ON task_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_comments.task_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM task_assignees
          WHERE task_id = tasks.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION public.handle_user_presence()
RETURNS trigger AS $$
BEGIN
  UPDATE users
  SET last_seen = now()
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user presence
CREATE TRIGGER on_presence_change
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_presence();