import { useState, useMemo } from 'react';
import { Todo } from '@/types/todo';
import { matchesDateFilter } from '@/utils/dateUtils';

export function useTodoFilters(todos: Todo[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredTodos = useMemo(() => {
    if (selectedFilters.length === 0) return todos;

    return todos.filter((todo) => {
      if (!todo.todo_date) return false;
      const todoDate = new Date(todo.todo_date);

      return selectedFilters.some((filter) =>
        matchesDateFilter(todoDate, filter)
      );
    });
  }, [todos, selectedFilters]);

  return {
    searchQuery,
    setSearchQuery,
    showDateFilter,
    setShowDateFilter,
    selectedFilters,
    toggleFilter,
    filteredTodos,
  };
}
