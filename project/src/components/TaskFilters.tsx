import React from 'react';
import { Filter, TeamMember, Priority, Status } from '../types';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
  filter: Filter;
  teamMembers: TeamMember[];
  onFilterChange: (filter: Filter) => void;
}

export function TaskFilters({ filter, teamMembers, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search || ''}
            onChange={(e) =>
              onFilterChange({ ...filter, search: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <select
          value={filter.assignee || ''}
          onChange={(e) =>
            onFilterChange({ ...filter, assignee: e.target.value || undefined })
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Members</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          value={filter.priority || ''}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              priority: (e.target.value as Priority) || undefined,
            })
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}