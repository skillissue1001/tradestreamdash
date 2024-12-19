import { useState } from 'react';
import { Task, Status } from '../types';

export function useDragAndDrop(initialTasks: Task[]) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status, lastUpdated: new Date() } : task
      )
    );
  };

  return {
    tasks,
    setTasks,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}