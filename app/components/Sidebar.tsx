// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '/dashboard.png' },
    { name: 'My Task', href: '/todos', icon: '/my task.png' },
    { name: 'Account Information', href: '/profile', icon: '/people.png' },
  ];

  return (
    <aside className="w-64 bg-[#1e3a5f] min-h-screen text-white flex flex-col z-40">
      {/* User Profile Section */}
      <div className="p-6 text-center border-b border-blue-800">
        <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-3 overflow-hidden">
          <Image
            src="/profile.jpg"
            alt="Profile"
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <h3 className="font-semibold">amanuel</h3>
        <p className="text-sm text-gray-300">aman@gmail.com</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
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
              <Image
                src={item.icon}
                alt={item.name}
                width={20}
                height={20}
                className="object-contain"
                unoptimized
              />
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
        <Image
          src="/Vector.png"
          alt="Logout"
          width={20}
          height={20}
          className="object-contain"
          unoptimized
        />
        <span>Logout</span>
      </button>
    </aside>
  );
}
