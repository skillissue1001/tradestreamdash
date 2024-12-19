import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UserMenuProps {
  onSignInClick: () => void;
}

export function UserMenu({ onSignInClick }: UserMenuProps) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <button
        onClick={onSignInClick}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <User className="h-5 w-5 mr-2" />
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {user.email}
      </span>
      <button
        onClick={() => signOut()}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}