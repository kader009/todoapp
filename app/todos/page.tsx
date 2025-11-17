'use client';
import { useState } from 'react';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const TodosPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleToggleFilter = (filter: string) => {
    setSelectedFilter((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Functionality will be added later
    console.log('New task:', newTaskTitle);
    setNewTaskTitle('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Sidebar er pore start hobe */}
      <div className="flex-1 flex flex-col">
        {/* Header - Sidebar er width er por theke shuru */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8 bg-linear-to-br from-blue-50 to-indigo-50">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Todos</h1>
                <div className="w-[68px] border-b-2 border-[#5272FF] mt-2"></div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  New Task
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative w-[935px] h-[36px]">
                <input
                  type="text"
                  placeholder="Search your task here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-4 pr-14 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg outline-none focus:border-blue-500"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg">
                  <Search className="text-white" size={20} />
                </div>
              </div>

              {/* Date Filter Button */}
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="h-[36px] px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative inline-flex items-center gap-2"
              >
                <span className="text-gray-700 text-sm whitespace-nowrap">
                  Filter By
                </span>
                <Image
                  src="/filter.png"
                  alt="Filter"
                  width={10.51}
                  height={10.24}
                  className="object-contain flex-shrink-0"
                  unoptimized
                />

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
                          className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
              </button>
            </div>

            {/* Todo List */}
            <div className="bg-white rounded-xl shadow-md p-8 min-h-[500px]">
              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <Image
                    src="/todo.png"
                    alt="No todos"
                    width={200}
                    height={200}
                    // className="opacity-30"
                    unoptimized
                  />
                </div>
                <p className="text-xl text-gray-400 font-medium">
                  No todos yet
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Add New Task
            </h2>

            <form onSubmit={handleAddTodo}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTaskModal(false);
                    setNewTaskTitle('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosPage;
