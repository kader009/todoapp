'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/libs/hook';
import { logout } from '@/libs/feature/authSlice';
import { clearTodos } from '@/libs/feature/todoSlice';
import { toast } from 'sonner';
import { NAV_ITEMS, STORAGE_KEYS } from '@/constants';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    dispatch(logout());
    dispatch(clearTodos());

    toast.success('Logged out successfully!');

    router.push('/login');
  };

  return (
    <aside
      className="w-[340xp] bg-[#0D224A] min-h-screen text-white flex flex-col z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* User Profile Section */}
      <div
        className="p-6 text-center mt-[60px]"
        role="region"
        aria-label="User profile"
      >
        <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-3 overflow-hidden border border-white">
          <Image
            src={
              user?.profile_image
                ? user.profile_image.startsWith('http')
                  ? user.profile_image
                  : `https://todo-app.pioneeralpha.com${
                      user.profile_image.startsWith('/') ? '' : '/'
                    }${user.profile_image}`
                : '/profile.jpg'
            }
            alt={`${user?.first_name || 'User'}'s profile picture`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <h3 className="font-semibold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : user?.id ? (
            user?.first_name && user?.last_name ? (
              `${user.first_name} ${user.last_name}`
            ) : user?.email ? (
              user.email.split('@')[0]
            ) : (
              `User #${user.id}`
            )
          ) : (
            'amanuel'
          )}
        </h3>
        <p className="text-sm text-gray-300">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : user?.id ? (
            user?.email || 'Please wait...'
          ) : (
            'amanuel@gmail.com'
          )}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1" aria-label="Main menu">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-8 py-3 mb-2 transition-colors text-base ${
                isActive
                  ? 'bg-linear-to-r from-[#5272FF]/40 to-[#0D224A]/60 text-white'
                  : 'text-gray-300 hover:bg-blue-800'
              }`}
            >
              <Image
                src={item.icon}
                alt=""
                width={20}
                height={20}
                className={`object-contain ${
                  isActive ? 'brightness-0 invert' : ''
                }`}
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
        aria-label="Logout from account"
        className="flex items-center gap-3 px-8 py-4 text-gray-300 hover:bg-blue-800 transition-colors cursor-pointer"
      >
        <Image
          src="/Vector.png"
          alt=""
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
