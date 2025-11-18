'use client';
import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
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
    if (!newTaskDate) {
      toast.error('Please select a date');
      return;
    }

    // Create todo
    await dispatch(
      createTodo({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        todo_date: newTaskDate,
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
    if (!editTaskDate) {
      toast.error('Please select a date');
      return;
    }

    // Update todo
    await dispatch(
      updateTodo({
        id: editTaskId,
        title: editTaskTitle,
        description: editTaskDescription,
        priority: editTaskPriority,
        todo_date: editTaskDate,
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
              {/* Search Bar */}
              <div className="relative flex-1 w-full h-9">
                <input
                  type="text"
                  placeholder="Search your task here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-4 pr-14 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg outline-none focus:border-blue-500"
                />
                <div className="absolute right-0 top-0 bg-[#5272FF] rounded-r-lg w-9 h-9 flex items-center justify-center">
                  <Search className="text-white" size={20} />
                </div>
              </div>

              {/* Date Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className="h-9 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-gray-700 text-sm">Filter By</span>
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
            {loading && todos.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[469px] flex items-center justify-center">
                <p className="text-gray-500">Loading todos...</p>
              </div>
            ) : todos.length === 0 ? (
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

                {/* Todo Items - Grid Layout with proper gap */}
                <div className="grid grid-cols-[repeat(auto-fill,348px)] gap-4 justify-start">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="w-[348px] h-[180px] rounded-lg border border-[#FEE2E2] p-6 hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                    >
                      <div>
                        {/* Title and Priority on same line */}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-800 flex-1 truncate pr-2">
                            {todo.title}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium text-white ${
                                todo.priority === 'extreme'
                                  ? 'bg-pink-600'
                                  : todo.priority === 'moderate'
                                  ? 'bg-green-600'
                                  : 'bg-yellow-500'
                              }`}
                            >
                              {todo.priority.charAt(0).toUpperCase() +
                                todo.priority.slice(1)}
                            </span>
                            <Image
                              src="/priority.png"
                              alt="Priority"
                              width={16}
                              height={16}
                              unoptimized
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {todo.description}
                        </p>
                      </div>

                      {/* Date, Update, Delete on same line */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Due{' '}
                          {new Date(todo.todo_date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Update/Edit Icon */}
                          <button
                            onClick={() => handleOpenEditModal(todo)}
                            className="hover:opacity-75 transition-opacity"
                          >
                            <Image
                              src="/edit.png"
                              alt="Edit"
                              width={20}
                              height={20}
                              unoptimized
                            />
                          </button>
                          {/* Delete Icon */}
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="hover:opacity-75 transition-opacity"
                          >
                            <Image
                              src="/delete.png"
                              alt="Delete"
                              width={20}
                              height={20}
                              unoptimized
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New Task Modal */}
          {showNewTaskModal && (
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewTaskModal(false)}
            >
              <div
                className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Add New Task
                    </h2>
                    <div className="w-[66px] border-b-2 border-[#5272FF] mt-2"></div>
                  </div>
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-800"
                  >
                    <span>Go Back</span>
                    <div className="border-b border-black mt-1"></div>
                  </button>
                </div>

                <form onSubmit={handleAddTodo} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder=""
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      autoFocus
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Priority
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="extreme"
                          checked={newTaskPriority === 'extreme'}
                          onChange={(e) =>
                            setNewTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                        <span className="text-sm">Extreme</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="moderate"
                          checked={newTaskPriority === 'moderate'}
                          onChange={(e) =>
                            setNewTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        <span className="text-sm">Moderate</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="low"
                          checked={newTaskPriority === 'low'}
                          onChange={(e) =>
                            setNewTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="text-sm">Low</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Task Description
                    </label>
                    <textarea
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Start writing here..."
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#5272FF] text-white w-[90px] h-[34px] rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Done'}
                    </button>

                    <button
                      type="button"
                      className="hover:opacity-75 transition-opacity"
                    >
                      <Image
                        src="/delet.png"
                        alt="Delete"
                        width={34}
                        height={34}
                        unoptimized
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Task Modal */}
          {showEditTaskModal && (
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={handleCancelEdit}
            >
              <div
                className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Update Task
                    </h2>
                    <div className="w-[66px] border-b-2 border-[#5272FF] mt-2"></div>
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="text-sm font-medium text-gray-600 hover:text-gray-800"
                  >
                    <span>Go Back</span>
                    <div className="border-b border-black mt-1"></div>
                  </button>
                </div>

                <form onSubmit={handleUpdateTodo} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                      placeholder=""
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      autoFocus
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={editTaskDate}
                        onChange={(e) => setEditTaskDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Priority
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-priority"
                          value="extreme"
                          checked={editTaskPriority === 'extreme'}
                          onChange={(e) =>
                            setEditTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                        <span className="text-sm">Extreme</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-priority"
                          value="moderate"
                          checked={editTaskPriority === 'moderate'}
                          onChange={(e) =>
                            setEditTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        <span className="text-sm">Moderate</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-priority"
                          value="low"
                          checked={editTaskPriority === 'low'}
                          onChange={(e) =>
                            setEditTaskPriority(
                              e.target.value as 'extreme' | 'moderate' | 'low'
                            )
                          }
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="text-sm">Low</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Task Description
                    </label>
                    <textarea
                      value={editTaskDescription}
                      onChange={(e) => setEditTaskDescription(e.target.value)}
                      placeholder="Start writing here..."
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#5272FF] text-white px-6 h-[34px] rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-6 h-[34px] rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TodosPage;
