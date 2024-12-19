import React from 'react';
import { Task, TeamMember } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusIcons = {
  todo: Circle,
  'in-progress': Clock,
  completed: CheckCircle2,
};

export function TaskCard({ task, teamMembers, onTaskClick, onDragStart }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];
  const assignedMembers = teamMembers.filter(member => task.assignees.includes(member.id));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onTaskClick(task)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {assignedMembers.map((member) => (
            <span
              key={member.id}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg"
              title={member.name}
            >
              {member.avatar}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {task.category}
        </span>
      </div>
    </div>
  );
}