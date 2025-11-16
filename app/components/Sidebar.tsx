// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CheckSquare, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/todos', icon: Home },
    { name: 'Todos', href: '/todos', icon: CheckSquare },
    { name: 'Account Information', href: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#1e3a5f] min-h-screen text-white flex flex-col z-40">
      {/* User Profile Section */}
      <div className="p-6 text-center border-b border-blue-800">
        <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-3 overflow-hidden">
          <img 
            src="/default-avatar.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold">amanuel</h3>
        <p className="text-sm text-gray-300">aman@gmail.com</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-blue-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-4 text-gray-300 hover:bg-blue-800 transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}