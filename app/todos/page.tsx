'use client';
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
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
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Sidebar er pore, full height nibe */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - Top e fixed */}
        <Header />

        {/* Page Content - Remaining space puro nibe */}
        <main className="flex-1 p-8 bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto">
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
              {/* Search Bar - Responsive width */}
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
                      <h3 className="font-semibold text-left text-gray-700">Date</h3>
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

            {/* Todo List - Flexible height */}
            <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[469px]">
              {/* Empty State */}
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
          </div>
        </main>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
                <label className="block text-sm font-medium mb-1">Title</label>
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
                <label className="block text-sm font-medium mb-1">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Image
                      src="/birthday.png"
                      alt="Date"
                      width={14}
                      height={14}
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="priority" 
                      value="extreme"
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
                  placeholder="Start writing here..."
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  className="bg-[#5272FF] text-white w-[90px] h-[34px] rounded-md hover:bg-blue-700 transition-colors"
                >
                  Done
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
    </div>
  );
};

export default TodosPage;
