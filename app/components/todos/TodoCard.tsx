import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoCardProps } from '@/types/components';

export default function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Card border color based on priority
  const cardBorderColor =
    todo.priority === 'extreme'
      ? 'border-[#FEE2E2]'
      : todo.priority === 'moderate'
      ? 'border-[#DCFCE7]'
      : 'border-[#FEF9C3]';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full h-[180px] rounded-lg border ${cardBorderColor} p-6 hover:shadow-md transition-shadow bg-white flex flex-col justify-between`}
    >
      <div>
        {/* Title and Priority on same line */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 transition-colors"
              aria-label="Drag to reorder"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M6 3.5C6 4.05228 5.55228 4.5 5 4.5C4.44772 4.5 4 4.05228 4 3.5C4 2.94772 4.44772 2.5 5 2.5C5.55228 2.5 6 2.94772 6 3.5Z"
                  fill="currentColor"
                />
                <path
                  d="M6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8C4 7.44772 4.44772 7 5 7C5.55228 7 6 7.44772 6 8Z"
                  fill="currentColor"
                />
                <path
                  d="M5 13.5C5.55228 13.5 6 13.0523 6 12.5C6 11.9477 5.55228 11.5 5 11.5C4.44772 11.5 4 11.9477 4 12.5C4 13.0523 4.44772 13.5 5 13.5Z"
                  fill="currentColor"
                />
                <path
                  d="M12 3.5C12 4.05228 11.5523 4.5 11 4.5C10.4477 4.5 10 4.05228 10 3.5C10 2.94772 10.4477 2.5 11 2.5C11.5523 2.5 12 2.94772 12 3.5Z"
                  fill="currentColor"
                />
                <path
                  d="M11 9C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9Z"
                  fill="currentColor"
                />
                <path
                  d="M12 12.5C12 13.0523 11.5523 13.5 11 13.5C10.4477 13.5 10 13.0523 10 12.5C10 11.9477 10.4477 11.5 11 11.5C11.5523 11.5 12 11.9477 12 12.5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <h3 className="text-base font-semibold text-gray-800 truncate pr-2">
              {todo.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`${
                todo.priority === 'low' ? 'w-12 h-[27px]' : 'w-[84px] h-[27px]'
              } rounded-sm text-xs font-medium flex items-center justify-center ${
                todo.priority === 'extreme'
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : todo.priority === 'moderate'
                  ? 'bg-[#DCFCE7] text-[#16A34A]'
                  : 'bg-[#FEF9C3] text-[#CA8A04]'
              }`}
            >
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            <Image
              src="/priority.png"
              alt="Priority"
              width={9}
              height={14}
              unoptimized
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 py-3.5">
          {todo.description}
        </p>
      </div>

      {/* Date, Update, Delete on same line */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">
          Due{' '}
          {new Date(todo.todo_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-2">
          {/* Update/Edit Icon */}
          <button
            onClick={() => onEdit(todo)}
            className="hover:opacity-75 transition-opacity bg-[#EEF7FF] w-8 h-8 rounded-lg flex justify-center items-center"
          >
            <Image
              src="/edit.png"
              alt="Edit"
              width={13}
              height={13}
              unoptimized
            />
          </button>
          {/* Delete Icon */}
          <button
            onClick={() => onDelete(todo.id)}
            className="hover:opacity-75 transition-opacity bg-[#DC2626]/10 w-8 h-8 rounded-lg flex justify-center items-center"
          >
            <Image
              src="/delete.png"
              alt="Delete"
              width={13}
              height={13}
              unoptimized
            />
          </button>
        </div>
      </div>
    </div>
  );
}
