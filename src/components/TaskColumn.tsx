import React from 'react';
import { Task, TeamMember } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TaskColumn({
  title,
  tasks,
  teamMembers,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskColumnProps) {
  return (
    <div
      className="flex-1 min-w-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            teamMembers={teamMembers}
            onTaskClick={onTaskClick}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}