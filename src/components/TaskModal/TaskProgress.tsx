import React from 'react';

interface TaskProgressProps {
  progress: number;
  onChange: (progress: number) => void;
}

export function TaskProgress({ progress, onChange }: TaskProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Progress</label>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}