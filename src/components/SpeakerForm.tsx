import { useState } from "react";
import type { FormEvent } from "react";
import { useSpeakerStore } from "../store/useSpeakerStore";
import type { Speaker } from "../store/useSpeakerStore";

// Helper to convert hours/minutes/seconds → total seconds
function parseDuration(hours: string, minutes: string, seconds: string): number {
  return (
    (parseInt(hours) || 0) * 3600 +
    (parseInt(minutes) || 0) * 60 +
    (parseInt(seconds) || 0)
  );
}

interface SpeakerFormProps {
  editingSpeaker?: Speaker | null;
  onCancel: () => void;
}

export function SpeakerForm({ editingSpeaker, onCancel }: SpeakerFormProps) {
  const { addSpeaker, editSpeaker } = useSpeakerStore();

  const [name, setName] = useState(editingSpeaker?.name || "");
  const [topic, setTopic] = useState(editingSpeaker?.topic || "");
  const [hours, setHours] = useState(
    editingSpeaker ? Math.floor(editingSpeaker.duration / 3600).toString() : "0"
  );
  const [minutes, setMinutes] = useState(
    editingSpeaker ? Math.floor((editingSpeaker.duration % 3600) / 60).toString() : "5"
  );
  const [seconds, setSeconds] = useState(
    editingSpeaker ? (editingSpeaker.duration % 60).toString() : "0"
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Speaker name is required");
    if (!topic.trim()) return setError("Topic is required");

    const duration = parseDuration(hours, minutes, seconds);
    if (duration <= 0) return setError("Duration must be greater than 0");

    if (editingSpeaker) {
      editSpeaker(editingSpeaker.id, { name: name.trim(), topic: topic.trim(), duration });
      onCancel();
    } else {
      addSpeaker({ name: name.trim(), topic: topic.trim(), duration });
      setName("");
      setTopic("");
      setHours("0");
      setMinutes("5");
      setSeconds("0");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        {editingSpeaker ? (
          <>
            <span className="text-blue-600">Edit Speaker:</span> {editingSpeaker.name}
          </>
        ) : (
          "Add New Speaker"
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Speaker Name */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">
            Speaker Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Topic */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">
            Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Introduction to React"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">
            Duration <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-between gap-3">
            {[
              { label: "Hours", value: hours, setter: setHours, min: 0, max: undefined },
              { label: "Minutes", value: minutes, setter: setMinutes, min: 0, max: 59 },
              { label: "Seconds", value: seconds, setter: setSeconds, min: 0, max: 59 },
            ].map(({ label, value, setter, min, max }, i) => (
              <div key={label} className="flex flex-col flex-1 text-center relative">
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium outline-none transition"
                />
                <span className="text-xs text-gray-500 mt-1">{label}</span>
                {i < 2 && (
                  <span className="absolute right-2 top-3 text-lg text-gray-400 font-semibold">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition font-medium"
          >
            {editingSpeaker ? "Update Speaker" : "Add Speaker"}
          </button>

          {editingSpeaker && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
