import React from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../../types';

interface HeaderProps {
  onAddTask: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ onAddTask, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LayoutDashboard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              Team Board
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              onClick={onAddTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}