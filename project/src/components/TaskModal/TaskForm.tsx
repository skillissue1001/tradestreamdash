import React, { useState } from 'react';
import { Task, TeamMember, Priority, Status } from '../../types';
import { TaskStatusSelect } from './TaskStatusSelect';
import { AssigneeSelect } from './AssigneeSelect';
import { Trash2 } from 'lucide-react';
import { generateId } from '../../utils/generateId';

interface TaskFormProps {
  task?: Task | null;
  teamMembers: TeamMember[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
}

export function TaskForm({ task, teamMembers, onSubmit, onCancel, onDelete }: TaskFormProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo' as Status,
    priority: task?.priority || 'medium' as Priority,
    assignees: task?.assignees || [],
    category: task?.category || 'General',
    dueDate: task?.dueDate?.toISOString().split('T')[0] || 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: task?.tags?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: task?.id || generateId(),
      ...formData,
      progress: task?.progress || 0,
      createdAt: task?.createdAt || new Date(),
      lastUpdated: new Date(),
      dueDate: new Date(formData.dueDate),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      attachments: task?.attachments || [],
      comments: task?.comments || [],
    });
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="design, documentation, bug"
          />
        </div>

        <TaskStatusSelect
          status={formData.status}
          onChange={(status) => setFormData({ ...formData, status })}
        />

        <AssigneeSelect
          teamMembers={teamMembers}
          selectedAssignees={formData.assignees}
          onChange={(assignees) => setFormData({ ...formData, assignees })}
        />

        <div className="flex justify-between items-center pt-4">
          {task && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md inline-flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </button>
          )}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Task
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}