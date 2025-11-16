// components/Header.tsx
'use client';
import { Bell, Calendar } from 'lucide-react';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded"></div>
        <span className="font-bold text-xl">DREAMY SOFTWARE</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Calendar size={20} className="text-gray-600" />
        </button>

        <div className="text-sm text-gray-600">
          <div className="font-semibold">Friday</div>
          <div>{today}</div>
        </div>
      </div>
    </header>
  );
}