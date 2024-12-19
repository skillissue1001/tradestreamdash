export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed';
export type Theme = 'light' | 'dark';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignees: string[];
  category: string;
  createdAt: Date;
  dueDate: Date;
  progress: number;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  lastUpdated: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface Filter {
  search?: string;
  assignee?: string;
  priority?: Priority;
  status?: Status;
}