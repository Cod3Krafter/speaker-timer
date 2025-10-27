import { useSpeakerStore } from "./store/useSpeakerStore";
import type { Speaker } from "./store/useSpeakerStore";

// Helper: Format duration from seconds → "mm:ss"
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function TestPage() {
  const {
    speakers,
    currentSpeakerIndex,
    addSpeaker,
    deleteSpeaker,
    editSpeaker,
    loadNextSpeaker,
    moveSpeaker,
    getCurrentSpeaker,
  } = useSpeakerStore();

  const currentSpeaker = getCurrentSpeaker();

  const handleAddSpeaker = () => {
    const newSpeaker: Omit<Speaker, "id"> = {
      name: `Speaker ${speakers.length + 1}`,
      topic: `Topic ${speakers.length + 1}`,
      duration: 300, // 5 minutes
    };
    addSpeaker(newSpeaker);
  };

  const handleEdit = (id: string) => {
    editSpeaker(id, {
      name: "Edited Name",
      topic: "Edited Topic",
    });
  };

  const handleMove = (from: number, to: number) => {
    if (to >= 0 && to < speakers.length) moveSpeaker(from, to);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-800">
          Phase 1: Store & Data Structure Test
        </h1>

        {/* Controls */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={handleAddSpeaker}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Test Speaker
            </button>
            <button
              onClick={loadNextSpeaker}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Load Next Speaker
            </button>
          </div>
        </section>

        {/* Current Speaker */}
        {currentSpeaker && (
          <section className="bg-blue-50 border-2 border-blue-500 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              Current Speaker (Index: {currentSpeakerIndex})
            </h2>
            <div className="space-y-1 text-lg">
              <p>
                <strong>Name:</strong> {currentSpeaker.name}
              </p>
              <p>
                <strong>Topic:</strong> {currentSpeaker.topic}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {formatDuration(currentSpeaker.duration)}
              </p>
            </div>
          </section>
        )}

        {/* Speakers List */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Speakers List ({speakers.length})
          </h2>

          {speakers.length === 0 ? (
            <p className="text-gray-500 italic">No speakers added yet</p>
          ) : (
            <div className="space-y-3">
              {speakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className={`p-4 border rounded-lg transition ${
                    index === currentSpeakerIndex
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{speaker.name}</h3>
                      <p className="text-gray-600">{speaker.topic}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Duration: {formatDuration(speaker.duration)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleMove(index, index - 1)}
                          disabled={index === 0}
                          title="Move up"
                          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(index, index + 1)}
                          disabled={index === speakers.length - 1}
                          title="Move down"
                          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(speaker.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSpeaker(speaker.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Debug */}
        <section className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Store State (Debug)</h2>
          <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded overflow-auto">
            {JSON.stringify({ speakers, currentSpeakerIndex }, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

export default TestPage;
