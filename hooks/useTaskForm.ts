import { useState } from 'react';

type Priority = 'extreme' | 'moderate' | 'low';

interface TaskFormData {
  title: string;
  description: string;
  date: string;
  priority: Priority;
}

export function useTaskForm(initialPriority: Priority = 'moderate') {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    date: '',
    priority: initialPriority,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      priority: initialPriority,
    });
  };

  const setTitle = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  };

  const setDescription = (description: string) => {
    setFormData((prev) => ({ ...prev, description }));
  };

  const setDate = (date: string) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const setPriority = (priority: Priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  return {
    formData,
    setTitle,
    setDescription,
    setDate,
    setPriority,
    resetForm,
  };
}
