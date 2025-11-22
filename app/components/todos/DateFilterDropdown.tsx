import Image from 'next/image';
import { DATE_FILTERS } from '@/constants';

interface DateFilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFilters: string[];
  onFilterChange: (filter: string) => void;
  todosCount: number;
}

export default function DateFilterDropdown({
  isOpen,
  onToggle,
  selectedFilters,
  onFilterChange,
  todosCount,
}: DateFilterDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="h-[42px] min-h-[42px] w-full md:w-auto px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center md:justify-start gap-2 whitespace-nowrap"
        aria-label="Filter todos by date"
        aria-expanded={isOpen}
      >
        <span className="text-gray-700 text-sm">
          {todosCount > 0 ? 'Sort By' : 'Filter By'}
        </span>
        <Image
          src="/filter.png"
          alt=""
          width={11}
          height={10}
          className="object-contain"
          unoptimized
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full md:w-64 z-10">
          <div className="px-4 py-3">
            <h3 className="font-semibold text-left text-gray-700">Date</h3>
          </div>
          <div className="mx-4 border-b border-gray-200"></div>

          <div className="p-4">
            {DATE_FILTERS.map((filter) => (
              <label
                key={filter.id}
                className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => onFilterChange(filter.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  aria-label={filter.label}
                />
                <span className="text-gray-700">{filter.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
