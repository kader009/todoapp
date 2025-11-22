import { Search } from 'lucide-react';

import { SearchBarProps } from '@/types/components';

export default function SearchBar({
  value,
  onChange,
  className = '',
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center w-full h-[42px] min-h-[42px] bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors ${className}`}
    >
      <input
        type="text"
        placeholder="Search your task here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-full pl-4 py-2 text-gray-700 placeholder-[#4B5563] outline-none min-w-0"
      />
      <div className="w-[42px] min-w-[42px] h-full min-h-[42px] bg-[#5272FF] flex items-center justify-center shrink-0 cursor-default">
        <Search className="text-white" size={20} />
      </div>
    </div>
  );
}
