import { Task, TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Cosmo',
    avatar: '👨',
    role: 'Project Manager',
  },
  {
    id: '2',
    name: 'Gian',
    avatar: '👨‍💼',
    role: 'Developer',
  },
  {
    id: '3',
    name: 'AlgoQ',
    avatar: '👩‍💻',
    role: 'Developer',
  },
  {
    id: '4',
    name: 'Kiko',
    avatar: '👨‍🎨',
    role: 'Designer',
  },
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create and document our new design system components',
    status: 'in-progress',
    priority: 'high',
    assignees: ['1', '4'],
    category: 'Design',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 60,
    tags: ['design', 'documentation'],
    attachments: [],
    comments: [],
    lastUpdated: new Date(),
  },
];