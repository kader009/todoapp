import { Search } from 'lucide-react';

import { SearchBarProps } from '@/types/components';

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1 w-full h-9">
      <input
        type="text"
        placeholder="Search your task here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full pl-4 pr-14 bg-white border border-gray-300 text-gray-700 placeholder-[#4B5563] rounded-lg outline-none focus:border-blue-500"
      />
      <div className="absolute right-0 top-0 bg-[#5272FF] rounded-r-lg w-9 h-9 flex items-center justify-center">
        <Search className="text-white" size={20} />
      </div>
    </div>
  );
}
