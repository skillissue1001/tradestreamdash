import React from 'react';
import { TeamMember } from '../../types';

interface AssigneeSelectProps {
  teamMembers: TeamMember[];
  selectedAssignees: string[];
  onChange: (assignees: string[]) => void;
}

export function AssigneeSelect({ teamMembers, selectedAssignees, onChange }: AssigneeSelectProps) {
  const handleChange = (memberId: string) => {
    const newAssignees = selectedAssignees.includes(memberId)
      ? selectedAssignees.filter(id => id !== memberId)
      : [...selectedAssignees, memberId];
    onChange(newAssignees);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Assignees
      </label>
      <div className="flex flex-wrap gap-2">
        {teamMembers.map((member) => {
          const isSelected = selectedAssignees.includes(member.id);
          return (
            <label
              key={member.id}
              className={`inline-flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => handleChange(member.id)}
              />
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg">
                  {member.avatar}
                </span>
                <span className={`text-sm ${
                  isSelected
                    ? 'text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {member.name}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}