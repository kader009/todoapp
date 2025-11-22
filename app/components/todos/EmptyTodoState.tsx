import Image from 'next/image';

export default function EmptyTodoState() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[380px]">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative mb-5">
          <Image
            src="/todo.png"
            alt="No todos illustration"
            width={170}
            height={170}
            unoptimized
          />
        </div>
        <p className="text-[22px] text-[#201F1E] font-medium">No todos yet</p>
      </div>
    </div>
  );
}
