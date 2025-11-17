import Image from 'next/image';

export default function Header() {
  const date = new Date();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-[69px] py-4 flex items-center justify-between h-[88px]">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/Group.png"
          alt="Logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-lg leading-tight">DREAMY</span>
          <span className="font-bold text-sm leading-tight">SOFTWARE</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button>
          <Image
            src="/Notifications.png"
            alt="Notifications"
            width={34}
            height={34}
            className="object-contain"
            unoptimized
            quality={100}
          />
        </button>

        <button>
          <Image
            src="/Cal.png"
            alt="Calendar"
            width={34}
            height={34}
            className="object-contain"
            unoptimized
            quality={100}
          />
        </button>

        <div className="text-sm text-gray-600">
          <div className="font-semibold">{weekday}</div>
          <div className="text-gray-500">{formattedDate}</div>
        </div>
      </div>
    </header>
  );
}
