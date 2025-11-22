import { Plus } from 'lucide-react';

interface TodoHeaderProps {
  onNewTask: () => void;
}

export default function TodoHeader({ onNewTask }: TodoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
      <div>
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#0D224A]">
          Todos
        </h1>
        <div className="w-[68px] border-b-2 border-[#5272FF] mt-2"></div>
      </div>

      <button
        onClick={onNewTask}
        className="bg-[#5272FF] text-white w-full md:w-[134px] h-[42px] rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        aria-label="Create new task"
      >
        <Plus size={20} />
        New Task
      </button>
    </div>
  );
}
