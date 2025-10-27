import { formatTime } from "../utils/helpers";
type TimerStatus = 'idle' | 'running' | 'paused';
interface TimerDisplayProps {
  timeRemaining: number;
  timerStatus: TimerStatus;
}

export function TimerDisplay({ timeRemaining, timerStatus }: TimerDisplayProps) {
  const isNegative = timeRemaining < 0;
  const isRunning = timerStatus === 'running';

  return (
    <div className={`text-center transition-colors duration-300 ${
      isNegative ? 'bg-red-100' : 'bg-white'
    } rounded-lg p-8 shadow-lg`}>
      <div className={`text-7xl font-mono font-bold mb-4 ${
        isNegative ? 'text-red-600' : 'text-gray-800'
      } ${isRunning && !isNegative ? 'animate-pulse' : ''}`}>
        {formatTime(timeRemaining)}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <div className={`w-3 h-3 rounded-full ${
          timerStatus === 'running' ? 'bg-green-500 animate-pulse' :
          timerStatus === 'paused' ? 'bg-yellow-500' :
          'bg-gray-400'
        }`} />
        <span className={`uppercase tracking-wide ${isNegative ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          {isNegative ? 'Time Exceeded' : timerStatus}
        </span>
      </div>
    </div>
  );
}