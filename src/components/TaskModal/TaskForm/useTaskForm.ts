import { useState } from 'react';
import { Task, Status, Priority } from '../../../types';
import { generateId } from '../../../utils/generateId';

interface UseTaskFormProps {
  task?: Task | null;
  onSubmit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function useTaskForm({ task, onSubmit, onDelete }: UseTaskFormProps) {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  return {
    formData,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleSubmit,
    handleInputChange,
    handleDelete,
  };
}