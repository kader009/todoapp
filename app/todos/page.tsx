'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Image from 'next/image';
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
import { useAppDispatch, useAppSelector } from '@/libs/hook';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
  type Todo,
} from '@/libs/feature/todoSlice';
import { getUserProfile } from '@/libs/feature/authSlice';

const TodosPage = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, error, createSuccess, updateSuccess, deleteSuccess } =
    useAppSelector((state) => state.todos);

  // Get user data to check if profile needs to be fetched
  const { user } = useAppSelector((state) => state.auth);

  // Local state for reordered todos (visual only)
  const [displayTodos, setDisplayTodos] = useState<Todo[]>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  // Form state for new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'extreme' | 'moderate' | 'low'
  >('moderate');

  // Form state for edit task
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskDate, setEditTaskDate] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<
    'extreme' | 'moderate' | 'low'
  >('moderate');

  // Fetch todos on mount
  useEffect(() => {
    dispatch(getTodos({}));
  }, [dispatch]);

  // Sync displayTodos with Redux todos
  useEffect(() => {
    setDisplayTodos(todos);
  }, [todos]);

  // Filter todos by selected filters
  const getFilteredTodos = () => {
    if (selectedFilter.length === 0) return displayTodos;

    const now = new Date();
    return displayTodos.filter((todo) => {
      if (!todo.todo_date) return false;
      const todoDate = new Date(todo.todo_date);
      for (const filter of selectedFilter) {
        if (filter === 'today') {
          if (
            todoDate.getFullYear() === now.getFullYear() &&
            todoDate.getMonth() === now.getMonth() &&
            todoDate.getDate() === now.getDate()
          ) {
            return true;
          }
        } else if (filter === '5days') {
          const diff =
            (todoDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          if (diff >= 0 && diff <= 5) return true;
        } else if (filter === '10days') {
          const diff =
            (todoDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          if (diff >= 0 && diff <= 10) return true;
        } else if (filter === '30days') {
          const diff =
            (todoDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          if (diff >= 0 && diff <= 30) return true;
        }
      }
      return false;
    });
  };

  // Fetch user profile if email is empty (only has user_id from JWT)
  useEffect(() => {
    if (user && user.id && !user.email) {
      console.log('User profile incomplete, fetching full data...');
      dispatch(getUserProfile());
    }
  }, [user, dispatch]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        dispatch(getTodos({ search: searchQuery }));
      } else {
        dispatch(getTodos({}));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Handle create success
  useEffect(() => {
    if (createSuccess) {
      toast.success('Todo created successfully!');
      dispatch(resetCreateSuccess());
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setShowNewTaskModal(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDate('');
        setNewTaskPriority('moderate');
      }, 500);
    }
  }, [createSuccess, dispatch]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Todo updated successfully!');
      dispatch(resetUpdateSuccess());
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setShowEditTaskModal(false);
        setEditTaskId(null);
        setEditTaskTitle('');
        setEditTaskDescription('');
        setEditTaskDate('');
        setEditTaskPriority('moderate');
      }, 500);
    }
  }, [updateSuccess, dispatch]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Todo deleted successfully!');
      dispatch(resetDeleteSuccess());
    }
  }, [deleteSuccess, dispatch]);

  const handleToggleFilter = (filter: string) => {
    setSelectedFilter((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Handle drag end - Visual reorder only (no API call)
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

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!newTaskDescription.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    // Create todo
    await dispatch(
      createTodo({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        ...(newTaskDate && { todo_date: newTaskDate }),
      })
    );
  };

  const handleDeleteTodo = async (id: number) => {
    await dispatch(deleteTodo(id));
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditTaskId(todo.id);
    setEditTaskTitle(todo.title);
    setEditTaskDescription(todo.description);
    setEditTaskDate(todo.todo_date);
    setEditTaskPriority(todo.priority);
    setShowEditTaskModal(true);
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTaskId) return;

    // Validation
    if (!editTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!editTaskDescription.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    // Update todo
    await dispatch(
      updateTodo({
        id: editTaskId,
        title: editTaskTitle,
        description: editTaskDescription,
        priority: editTaskPriority,
        ...(editTaskDate && { todo_date: editTaskDate }),
      })
    );
  };

  const handleCancelEdit = () => {
    setShowEditTaskModal(false);
    setEditTaskId(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
    setEditTaskDate('');
    setEditTaskPriority('moderate');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8 bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto relative">
          <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-[34px] font-bold text-[#0D224A]">Todos</h1>
                <div className="w-[68px] border-b-2 border-[#5272FF] mt-2"></div>
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="bg-[#5272FF] text-white w-[134px] h-[42px] rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              {/* Date Filter Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className="h-9 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-gray-700 text-sm">
                    {displayTodos.length > 0 ? 'Sort By' : 'Filter By'}
                  </span>
                  <Image
                    src="/filter.png"
                    alt="Filter"
                    width={11}
                    height={10}
                    className="object-contain"
                    unoptimized
                  />
                </button>

                {/* Date Filter Dropdown */}
                {showDateFilter && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-10">
                    <div className="px-4 py-3">
                      <h3 className="font-semibold text-left text-gray-700">
                        Date
                      </h3>
                    </div>
                    <div className="mx-4 border-b border-gray-200"></div>

                    <div className="p-4">
                      {[
                        { id: 'today', label: 'Deadline Today' },
                        { id: '5days', label: 'Expires in 5 days' },
                        { id: '10days', label: 'Expires in 10 days' },
                        { id: '30days', label: 'Expires in 30 days' },
                      ].map((filter) => (
                        <label
                          key={filter.id}
                          className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilter.includes(filter.id)}
                            onChange={() => handleToggleFilter(filter.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{filter.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Todo List Section */}
            {loading && getFilteredTodos().length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[469px] flex items-center justify-center">
                <p className="text-gray-500">Loading todos...</p>
              </div>
            ) : getFilteredTodos().length === 0 ? (
              /* Empty State with white background */
              <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[469px]">
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative mb-6">
                    <Image
                      src="/todo.png"
                      alt="No todos"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                  <p className="text-[24px] text-[#201F1E] font-medium">
                    No todos yet
                  </p>
                </div>
              </div>
            ) : (
              /* Todos exist - No white background, just cards */
              <div>
                {/* Your Todos Heading */}
                <h2 className="text-2xl font-semibold text-[#0D224A] mb-6">
                  Your Tasks
                </h2>

                {/* Todo Items - Grid Layout with Drag & Drop */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={getFilteredTodos().map((todo) => todo.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-[repeat(auto-fill,348px)] gap-4 justify-start">
                      {getFilteredTodos().map((todo) => (
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
            title={newTaskTitle}
            description={newTaskDescription}
            date={newTaskDate}
            priority={newTaskPriority}
            loading={loading}
            onClose={() => setShowNewTaskModal(false)}
            onSubmit={handleAddTodo}
            onTitleChange={setNewTaskTitle}
            onDescriptionChange={setNewTaskDescription}
            onDateChange={setNewTaskDate}
            onPriorityChange={setNewTaskPriority}
          />

          {/* Edit Task Modal */}
          <TaskModal
            isOpen={showEditTaskModal}
            mode="edit"
            title={editTaskTitle}
            description={editTaskDescription}
            date={editTaskDate}
            priority={editTaskPriority}
            loading={loading}
            onClose={handleCancelEdit}
            onSubmit={handleUpdateTodo}
            onTitleChange={setEditTaskTitle}
            onDescriptionChange={setEditTaskDescription}
            onDateChange={setEditTaskDate}
            onPriorityChange={setEditTaskPriority}
          />
        </main>
      </div>
    </div>
  );
};

export default TodosPage;
