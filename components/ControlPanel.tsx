import { useState, useEffect, useRef } from 'react';

interface ControlPanelProps {
  onTimeUpdate?: (time: string) => void;
}

export default function ControlPanel({ onTimeUpdate }: ControlPanelProps) {
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);

  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (onTimeUpdate) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      onTimeUpdate(timeString);
    }
  }, [onTimeUpdate]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      setIsStopwatchRunning(true);
      const startTime = Date.now() - stopwatchTime;
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    setIsStopwatchRunning(false);
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
  };

  const resetStopwatch = () => {
    stopStopwatch();
    setStopwatchTime(0);
  };

  const startCountdown = () => {
    if (countdownTime > 0 && !isCountdownRunning) {
      setIsCountdownRunning(true);
      setCountdownActive(true);
      const targetTime = Date.now() + countdownTime;
      countdownIntervalRef.current = setInterval(() => {
        const remaining = targetTime - Date.now();
        if (remaining <= 0) {
          setCountdownTime(0);
          setIsCountdownRunning(false);
          setCountdownActive(false);
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
        } else {
          setCountdownTime(remaining);
        }
      }, 100);
    }
  };

  const stopCountdown = () => {
    setIsCountdownRunning(false);
    setCountdownActive(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const resetCountdown = () => {
    stopCountdown();
    setCountdownTime(0);
  };

  const handleSetCountdown = (minutes: number) => {
    setCountdownTime(minutes * 60 * 1000);
  };

  return (
    <div className="mt-8 p-6 bg-black bg-opacity-30 rounded-2xl backdrop-blur-md border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <div className="text-white text-lg font-semibold">Controls</div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSetCountdown(1)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded text-white font-medium"
          >
            1m
          </button>
          <button
            onClick={() => handleSetCountdown(3)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded text-white font-medium"
          >
            3m
          </button>
          <button
            onClick={() => handleSetCountdown(5)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded text-white font-medium"
          >
            5m
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/50 rounded-2xl p-4">
          <div className="text-white text-sm mb-3">Stopwatch</div>
          <div className="text-3xl font-bold text-white mb-4">
            {formatTime(stopwatchTime)}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={isStopwatchRunning ? stopStopwatch : startStopwatch}
              className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded text-white font-medium"
            >
              {isStopwatchRunning ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={resetStopwatch}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded text-white font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-black/50 rounded-2xl p-4">
          <div className="text-white text-sm mb-3">Countdown</div>
          <div className="text-3xl font-bold text-white mb-4">
            {countdownActive && formatTime(countdownTime)}
            {!countdownActive && countdownTime > 0 && formatTime(countdownTime)}
            {countdownTime === 0 && '00:00'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={isCountdownRunning ? stopCountdown : startCountdown}
              className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 transition-colors rounded text-white font-medium"
            >
              {isCountdownRunning ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={resetCountdown}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded text-white font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            });
            if (onTimeUpdate) onTimeUpdate(timeString);
          }}
          className="px-6 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full text-white font-medium"
        >
          Get Current Time
        </button>
      </div>
    </div>
  );
}