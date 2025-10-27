import { useSpeakerStore } from "../store/useSpeakerStore";
import { SpeakerListItem } from "./SpeakerListItem";
import type { Speaker } from "../store/useSpeakerStore";
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface SpeakerListProps {
  onEditSpeaker: (speaker: Speaker) => void;
}

export function SpeakerList({ onEditSpeaker }: SpeakerListProps) {
  const { speakers, currentSpeakerIndex, deleteSpeaker, moveSpeaker } = useSpeakerStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this speaker?")) {
      deleteSpeaker(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = speakers.findIndex((s) => s.id === active.id);
      const newIndex = speakers.findIndex((s) => s.id === over.id);
      
      moveSpeaker(oldIndex, newIndex);
    }
  };

  if (speakers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No speakers yet</h3>
        <p className="text-gray-500">Add your first speaker using the form above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Speaker Queue ({speakers.length})
      </h2>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={speakers.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {speakers.map((speaker, index) => (
              <SpeakerListItem
                key={speaker.id}
                speaker={speaker}
                index={index}
                isActive={index === currentSpeakerIndex}
                onEdit={() => onEditSpeaker(speaker)}
                onDelete={() => handleDelete(speaker.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
