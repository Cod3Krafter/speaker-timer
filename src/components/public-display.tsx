
import { useEffect } from "react";
import type { Speaker } from "../store/useSpeakerStore";
import { formatTime } from "../utils/helpers";

type TimerStatus = 'idle' | 'running' | 'paused';

interface PublicDisplayProps {
  speaker: Speaker | null;
  timeRemaining: number;
  timerStatus: TimerStatus;
}

// Helper function to calculate background colors based on time remaining
function getBackgroundColors(timeRemaining: number, initialDuration: number): { from: string; to: string } {
  if (timeRemaining < 0) {
    return { from: 'from-red-600', to: 'to-red-800' };
  }

  // Start transition when 20% of time remains
  const transitionPoint = initialDuration * 0.2;
  
  if (timeRemaining > transitionPoint) {
    return { from: 'from-blue-600', to: 'to-blue-800' };
  }

  // Calculate blend factor (0 = full blue, 1 = full red)
  const blend = 1 - (timeRemaining / transitionPoint);
  
  const colors = {
    from: blend >= 0.8 ? 'from-red-600' : 
          blend >= 0.6 ? 'from-red-500' :
          blend >= 0.4 ? 'from-purple-600' :
          blend >= 0.2 ? 'from-indigo-600' :
          'from-blue-600',
    to: blend >= 0.8 ? 'to-red-800' :
        blend >= 0.6 ? 'to-red-700' :
        blend >= 0.4 ? 'to-purple-800' :
        blend >= 0.2 ? 'to-indigo-800' :
        'to-blue-800'
  };

  return colors;
}

export function PublicDisplay({ speaker, timeRemaining, timerStatus }: PublicDisplayProps) {
  const isNegative = timeRemaining < 0;

  // Calculate background colors based on time remaining
  const colors = getBackgroundColors(timeRemaining, speaker?.duration || 0);

  // Update document title with speaker info
  useEffect(() => {
    if (speaker) {
      document.title = `${speaker.name} - ${formatTime(timeRemaining)} - Speaker Timer`;
    } else {
      document.title = 'Waiting for Speaker - Speaker Timer';
    }
  }, [speaker, timeRemaining]);

  if (!speaker) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-white/20 mb-8">
            <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white/60">Waiting for speaker...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-500 bg-linear-to-br ${colors.from} ${colors.to}`}>
      {/* Speaker Info */}
      <div className="text-center mb-12 max-w-5xl w-full">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {speaker.name}
        </h1>
        <p className="text-3xl md:text-4xl text-white/90 font-medium">
          {speaker.topic}
        </p>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className={`text-9xl md:text-[12rem] font-mono font-bold text-white drop-shadow-2xl mb-8 ${
          timerStatus === 'running' && !isNegative ? 'animate-pulse' : ''
        }`}>
          {formatTime(timeRemaining)}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-4">
          {/* <div className={`w-6 h-6 rounded-full ${
            timerStatus === 'running' ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' :
            timerStatus === 'paused' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' :
            'bg-gray-400'
          }`} /> */}
          <span className="text-3xl text-white/90 uppercase tracking-widest font-semibold animate-bounce">
            {isNegative ? 'Time Exceeded' : timerStatus}
          </span>
        </div>
      </div>
    </div>
  );
}