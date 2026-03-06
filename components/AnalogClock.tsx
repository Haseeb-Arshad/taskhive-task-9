import { useEffect, useRef } from 'react';

interface AnalogClockProps {
  size?: number;
  showDigital?: boolean;
}

export default function AnalogClock({ size = 300, showDigital = true }: AnalogClockProps) {
  const clockRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const radius = canvas.width / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw clock face
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw hour marks
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6;
          ctx.beginPath();
          ctx.moveTo(
            radius + Math.cos(angle) * (radius - 20),
            radius + Math.sin(angle) * (radius - 20)
          );
          ctx.lineTo(
            radius + Math.cos(angle) * (radius - 40),
            radius + Math.sin(angle) * (radius - 40)
          );
          ctx.stroke();
        }

        // Draw hands
        const drawHand = (length: number, width: number, angle: number, color: string) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(radius, radius);
          ctx.lineTo(
            radius + Math.cos(angle) * length,
            radius + Math.sin(angle) * length
          );
          ctx.stroke();
        };

        const secondAngle = (seconds * Math.PI) / 30;
        const minuteAngle = (minutes * Math.PI) / 30 + (seconds * Math.PI) / 1800;
        const hourAngle = ((hours % 12) * Math.PI) / 6 + (minutes * Math.PI) / 360;

        drawHand(radius * 0.5, 1, secondAngle, '#ff6b6b');
        drawHand(radius * 0.7, 3, minuteAngle, '#4ecdc4');
        drawHand(radius * 0.5, 5, hourAngle, '#45b7d1');

        // Center dot
        ctx.beginPath();
        ctx.arc(radius, radius, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-{size} h-{size}">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="mx-auto rounded-full shadow-2xl"
      />
      {showDigital && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="text-3xl font-bold text-white bg-black bg-opacity-60 px-6 py-2 rounded-full">
            {/* Digital time will be displayed here */}
          </div>
        </div>
      )}
    </div>
  );
}