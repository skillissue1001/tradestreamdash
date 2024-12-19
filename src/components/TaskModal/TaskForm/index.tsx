import React from 'react';
import { Task, TeamMember } from '../../../types';
import { useTaskForm } from './useTaskForm';
import { FormFields } from './FormFields';
import { FormActions } from './FormActions';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface TaskFormProps {
  task?: Task | null;
  teamMembers: TeamMember[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
}

export function TaskForm({ task, teamMembers, onSubmit, onCancel, onDelete }: TaskFormProps) {
  const {
    formData,
    showDeleteConfirm,
    handleSubmit,
    handleInputChange,
    handleDelete,
    setShowDeleteConfirm
  } = useTaskForm({ task, onSubmit, onDelete });

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormFields
          formData={formData}
          teamMembers={teamMembers}
          onChange={handleInputChange}
        />
        <FormActions
          isEditing={!!task}
          onCancel={onCancel}
          onDeleteClick={() => setShowDeleteConfirm(true)}
          canDelete={!!onDelete}
        />
      </form>

      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}