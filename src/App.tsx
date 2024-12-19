import React, { useState } from 'react';
import { Task, Filter } from './types';
import { Header } from './components/Header/Header';
import { TaskColumn } from './components/TaskColumn';
import { TaskFilters } from './components/TaskFilters';
import { TaskModal } from './components/TaskModal/TaskModal';
import { initialTasks, teamMembers } from './data';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { tasks, setTasks, handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Filter>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSelectedTask(null); // Reset selected task after deletion
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    console.log('handleTaskUpdate called with:', updatedTask);
    
    setTasks((prevTasks) => {
      const taskExists = prevTasks.some((task) => task.id === updatedTask.id);
      if (taskExists) {
        return prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      return [...prevTasks, updatedTask]; // Add new task if it doesn't exist
    });
    
    setSelectedTask(null); // Reset selected task
    setIsAddingTask(false); // Close modal if updating
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.assignee && !task.assignees.includes(filter.assignee)) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    return true;
  });

  const columns = ['todo', 'in-progress', 'completed'] as const;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header
        onAddTask={() => {
          console.log('Add Task clicked');
          setIsAddingTask(true); // Open the modal for task creation
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskFilters
          filter={filter}
          teamMembers={teamMembers}
          onFilterChange={setFilter}
        />

        <div className="mt-8 flex space-x-4 overflow-x-auto pb-4">
          {columns.map((status) => (
            <TaskColumn
              key={status}
              title={status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              tasks={filteredTasks.filter((task) => task.status === status)}
              teamMembers={teamMembers}
              onTaskClick={setSelectedTask} // Open the modal for task editing
              onDragStart={handleDragStart}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, status)}
            />
          ))}
        </div>
      </main>

      {(selectedTask || isAddingTask) && (
        <TaskModal
          task={selectedTask}
          teamMembers={teamMembers}
          onClose={() => {
            setSelectedTask(null); // Reset selected task when modal is closed
            setIsAddingTask(false); // Reset adding task state
          }}
          onUpdate={handleTaskUpdate}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
