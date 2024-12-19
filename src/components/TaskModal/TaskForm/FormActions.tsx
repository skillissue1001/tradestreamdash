import React from 'react';
import { Trash2 } from 'lucide-react';

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  onDeleteClick: () => void;
  canDelete: boolean;
}

export function FormActions({ isEditing, onCancel, onDeleteClick, canDelete }: FormActionsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      {isEditing && canDelete && (
        <button
          type="button"
          onClick={onDeleteClick}
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
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </div>
  );
}