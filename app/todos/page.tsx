'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/todos/SearchBar';
import TodoCard from '../components/todos/TodoCard';
import TaskModal from '../components/todos/TaskModal';
import TodoHeader from '../components/todos/TodoHeader';
import DateFilterDropdown from '../components/todos/DateFilterDropdown';
import EmptyTodoState from '../components/todos/EmptyTodoState';

import { useAppDispatch, useAppSelector } from '@/libs/hook';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
} from '@/libs/feature/todoSlice';
import { getUserProfile } from '@/libs/feature/authSlice';
import { Todo } from '@/types/todo';
import { useTaskForm } from '@/hooks/useTaskForm';
import { useTodoFilters } from '@/hooks/useTodoFilters';
import { parseFlexibleDate } from '@/utils/dateUtils';

const TodosPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { todos, loading, error, createSuccess, updateSuccess, deleteSuccess } =
    useAppSelector((state) => state.todos);
  const { user } = useAppSelector((state) => state.auth);

  const [displayTodos, setDisplayTodos] = useState<Todo[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  // Custom hooks
  const newTask = useTaskForm();
  const editTask = useTaskForm();
  const filters = useTodoFilters(displayTodos);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch todos on mount
  useEffect(() => {
    dispatch(getTodos({}));
  }, [dispatch]);

  useEffect(() => {
    setDisplayTodos(todos);
  }, [todos]);

  // Fetch user profile if incomplete
  useEffect(() => {
    if (user && user.id && !user.email) {
      dispatch(getUserProfile());
    }
  }, [user, dispatch]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.searchQuery) {
        dispatch(getTodos({ search: filters.searchQuery }));
      } else {
        dispatch(getTodos({}));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchQuery, dispatch]);

  // Handle create success
  useEffect(() => {
    if (createSuccess) {
      toast.success('Todo created successfully!');
      dispatch(resetCreateSuccess());
      setTimeout(() => {
        setShowNewTaskModal(false);
        newTask.resetForm();
      }, 500);
    }
  }, [createSuccess, dispatch, newTask]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Todo updated successfully!');
      dispatch(resetUpdateSuccess());
      setTimeout(() => {
        setShowEditTaskModal(false);
        setEditTaskId(null);
        editTask.resetForm();
      }, 500);
    }
  }, [updateSuccess, dispatch, editTask]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Todo deleted successfully!');
      dispatch(resetDeleteSuccess());
    }
  }, [deleteSuccess, dispatch]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDisplayTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDate = parseFlexibleDate(newTask.formData.date);
    dispatch(
      createTodo({
        title: newTask.formData.title,
        description: newTask.formData.description,
        todo_date: parsedDate,
        priority: newTask.formData.priority,
      })
    );
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditTaskId(todo.id);
    editTask.setTitle(todo.title);
    editTask.setDescription(todo.description || '');
    editTask.setDate(todo.todo_date || '');
    editTask.setPriority(todo.priority as 'extreme' | 'moderate' | 'low');
    setShowEditTaskModal(true);
  };

  const handleUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskId) return;

    const parsedDate = parseFlexibleDate(editTask.formData.date);
    dispatch(
      updateTodo({
        id: editTaskId,
        title: editTask.formData.title,
        description: editTask.formData.description,
        todo_date: parsedDate,
        priority: editTask.formData.priority,
      })
    );
  };

  const handleDeleteTodo = (id: number) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-3 min-w-[300px]">
        <p className="font-medium text-gray-800">
          Are you sure you want to delete this todo?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch(deleteTodo(id));
              toast.dismiss(t);
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    ));
  };

  const handleCancelEdit = () => {
    setShowEditTaskModal(false);
    setEditTaskId(null);
    editTask.resetForm();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 bg-linear-to-br from-blue-50 to-indigo-50 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto w-full">
            <TodoHeader onNewTask={() => setShowNewTaskModal(true)} />

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
              <SearchBar
                value={filters.searchQuery}
                onChange={filters.setSearchQuery}
                className="flex-1"
              />
              <DateFilterDropdown
                isOpen={filters.showDateFilter}
                onToggle={() =>
                  filters.setShowDateFilter(!filters.showDateFilter)
                }
                selectedFilters={filters.selectedFilters}
                onFilterChange={filters.toggleFilter}
                todosCount={displayTodos.length}
              />
            </div>

            {/* Todo List Section */}
            {loading && filters.filteredTodos.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[350px] flex items-center justify-center">
                <p className="text-gray-500">Loading todos...</p>
              </div>
            ) : filters.filteredTodos.length === 0 ? (
              <EmptyTodoState />
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-[#0D224A] mb-6">
                  Your Tasks
                </h2>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filters.filteredTodos.map((todo) => todo.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {filters.filteredTodos.map((todo) => (
                        <TodoCard
                          key={todo.id}
                          todo={todo}
                          onEdit={handleOpenEditModal}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>

          {/* New Task Modal */}
          <TaskModal
            isOpen={showNewTaskModal}
            mode="new"
            title={newTask.formData.title}
            description={newTask.formData.description}
            date={newTask.formData.date}
            priority={newTask.formData.priority}
            loading={loading}
            onClose={() => setShowNewTaskModal(false)}
            onSubmit={handleAddTodo}
            onTitleChange={newTask.setTitle}
            onDescriptionChange={newTask.setDescription}
            onDateChange={newTask.setDate}
            onPriorityChange={newTask.setPriority}
          />

          {/* Edit Task Modal */}
          <TaskModal
            isOpen={showEditTaskModal}
            mode="edit"
            title={editTask.formData.title}
            description={editTask.formData.description}
            date={editTask.formData.date}
            priority={editTask.formData.priority}
            loading={loading}
            onClose={handleCancelEdit}
            onSubmit={handleUpdateTodo}
            onTitleChange={editTask.setTitle}
            onDescriptionChange={editTask.setDescription}
            onDateChange={editTask.setDate}
            onPriorityChange={editTask.setPriority}
          />
        </main>
      </div>
    </div>
  );
};

export default TodosPage;
