import Image from 'next/image';

import { TaskModalProps } from '@/types/components';

export default function TaskModal({
  isOpen,
  mode,
  title,
  description,
  date,
  priority,
  loading,
  onClose,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onPriorityChange,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-4 md:p-8 w-[95%] md:w-[591px] h-auto max-h-[90vh] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'new' ? 'Add New Task' : 'Update Task'}
            </h2>
            <div className="w-[66px] border-b-2 border-[#5272FF] mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            <span>Go Back</span>
            <div className="border-b border-black mt-1"></div>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder=""
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Image
                  src="/birthday.png"
                  alt="Date"
                  width={14.4}
                  height={14.4}
                  className="opacity-60"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="extreme"
                  checked={priority === 'extreme'}
                  onChange={(e) =>
                    onPriorityChange(
                      e.target.value as 'extreme' | 'moderate' | 'low'
                    )
                  }
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                <span className="text-sm">Extreme</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="moderate"
                  checked={priority === 'moderate'}
                  onChange={(e) =>
                    onPriorityChange(
                      e.target.value as 'extreme' | 'moderate' | 'low'
                    )
                  }
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span className="text-sm">Moderate</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === 'low'}
                  onChange={(e) =>
                    onPriorityChange(
                      e.target.value as 'extreme' | 'moderate' | 'low'
                    )
                  }
                  className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="w-2 h-2 rounded-full bg-[#CA8A04]"></span>
                <span className="text-sm">Low</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Task Description
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Start writing here..."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4">
            {mode === 'new' ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5272FF] text-white w-[90px] h-[34px] rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Done'}
                </button>

                <button
                  type="button"
                  className="hover:opacity-75 transition-opacity"
                >
                  <Image
                    src="/delet.png"
                    alt="Delete"
                    width={34}
                    height={34}
                    unoptimized
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5272FF] text-white px-6 h-[34px] rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#8CA3CD] text-white px-6 h-[34px] rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
