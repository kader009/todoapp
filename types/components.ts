import { FormEvent } from 'react';
import { Todo } from './todo';

export interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface FilterButtonsProps {
  showDateFilter: boolean;
  onToggleDateFilter: () => void;
  onNewTask: () => void;
}

export interface TaskModalProps {
  isOpen: boolean;
  mode: 'new' | 'edit';
  title: string;
  description: string;
  date: string;
  priority: 'extreme' | 'moderate' | 'low';
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onPriorityChange: (value: 'extreme' | 'moderate' | 'low') => void;
}
