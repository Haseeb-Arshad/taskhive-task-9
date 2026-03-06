import { useEffect, useState } from 'react';
import './styles/globals.css';

export default function ClockPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  return (
    <div className="clock-container">
      <div className="clock-face">
        <div className="hand hour-hand" style={{ transform: `translate(-50%, -50%) rotate(${hourDeg}deg)` }}></div>
        <div className="hand minute-hand" style={{ transform: `translate(-50%, -50%) rotate(${minuteDeg}deg)` }}></div>
        <div className="hand second-hand" style={{ transform: `translate(-50%, -50%) rotate(${secondDeg}deg)` }}></div>
      </div>
      
      <div className="digital-display">
        <div className="time-text">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}