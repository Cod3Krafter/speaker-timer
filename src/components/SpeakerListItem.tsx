import { formatDuration } from "../utils/helpers";
import type { Speaker } from "../store/useSpeakerStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SpeakerListItemProps {
  speaker: Speaker;
  index: number;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SpeakerListItem({
  speaker,
  isActive,
  onEdit,
  onDelete,
}: SpeakerListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: speaker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border-2 rounded-lg transition-all group ${isDragging ? 'opacity-50' : ''} ${
        isActive
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isActive && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                ACTIVE
              </span>
            )}
            <h3 className="font-semibold text-lg text-gray-800 truncate">
              {speaker.name}
            </h3>
          </div>

          <p className="text-gray-600 mb-2 line-clamp-2">{speaker.topic}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-medium">
              Duration: {formatDuration(speaker.duration)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Drag Handle */}
          <div 
            {...attributes}
            {...listeners}
            className="flex gap-1 justify-end cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded">
              ⋮⋮
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
