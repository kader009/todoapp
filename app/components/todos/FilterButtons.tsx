import Image from 'next/image';
import { Plus } from 'lucide-react';

interface FilterButtonsProps {
  showDateFilter: boolean;
  onToggleDateFilter: () => void;
  onNewTask: () => void;
}

export default function FilterButtons({
  showDateFilter,
  onToggleDateFilter,
  onNewTask,
}: FilterButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Filter by Date */}
      <button
        onClick={onToggleDateFilter}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Image
          src="/calendar.png"
          alt="Calendar"
          width={16}
          height={16}
          unoptimized
        />
        <span className="text-sm">Filter</span>
        <Image
          src="/dropdown.png"
          alt="Dropdown"
          width={12}
          height={12}
          className={`transition-transform ${
            showDateFilter ? 'rotate-180' : ''
          }`}
          unoptimized
        />
      </button>

      {/* New Task Button */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-2 px-4 py-2 bg-[#5272FF] text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">New Task</span>
      </button>
    </div>
  );
}
