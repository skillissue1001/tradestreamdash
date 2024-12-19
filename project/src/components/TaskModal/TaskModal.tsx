import React from 'react';
import { Task, TeamMember } from '../../types';
import { X } from 'lucide-react';
import { TaskForm } from './TaskForm';

interface TaskModalProps {
  task?: Task | null;
  teamMembers: TeamMember[];
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskModal({
  task,
  teamMembers,
  onClose,
  onUpdate,
  onDelete,
}: TaskModalProps) {
  const isEditing = !task;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Add New Task' : 'Edit Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <TaskForm
            task={task}
            teamMembers={teamMembers}
            onSubmit={onUpdate}
            onCancel={onClose}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}