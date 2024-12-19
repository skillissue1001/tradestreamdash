import React from 'react';
import { Status } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskStatusSelectProps {
  status: Status;
  onChange: (status: Status) => void;
}

const statusOptions: { value: Status; label: string; icon: React.ElementType }[] = [
  { value: 'todo', label: 'To Do', icon: Circle },
  { value: 'in-progress', label: 'In Progress', icon: Clock },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function TaskStatusSelect({ status, onChange }: TaskStatusSelectProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Status:</label>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as Status)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}