import React, { useState, useRef } from 'react';

export default function FortuneDrum({ prizes, ...props }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('Жми!');
  const drumInnerRef = useRef(null);

  // Функция вращения барабана
  function spinDrum() {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult("Барабан вращается...");

    const winningIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[winningIndex].name;

    const itemHeight = drumInnerRef.current?.firstChild?.offsetHeight || 50;
    const totalHeight = prizes.length * itemHeight;
    const drumHeight = 300;

    const pointerPosition = drumHeight / 2;
    const targetPosition = winningIndex * itemHeight + (itemHeight / 2) - pointerPosition;

    const fullCircles = 3;
    const extraSpin = fullCircles * totalHeight;
    const totalOffset = extraSpin + targetPosition;

    if (drumInnerRef.current) {
      drumInnerRef.current.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
      drumInnerRef.current.style.transform = `translateY(-${totalOffset}px)`;
    }

    setTimeout(() => {
      setResult(winningPrize);
      setIsSpinning(false);

      setTimeout(() => {
        if (drumInnerRef.current) {
          drumInnerRef.current.style.transition = 'none';
          const currentPosition = totalOffset % totalHeight;
          drumInnerRef.current.style.transform = `translateY(-${currentPosition}px)`;
        }
      }, 100);
    }, 5000);
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Заголовок */}
      <div className="mb-2 p-4 bg-blue-50/40 rounded-lg w-full text-center border border-white/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white text-shadow">
          Барабан Фортуны
        </h1>
      </div>

      {/* Контейнер барабана по центру */}
      <div className="flex justify-center items-center mb-4 w-full">
        {/* Левый указатель */}
        <div className="w-8 h-14 bg-gradient-to-r from-red-500 to-pink-500 clip-triangle-left z-10 shadow-lg mr-[-4px] rounded-r" />

        {/* Барабан */}
        <div className="relative w-70 h-80 overflow-hidden rounded-lg bg-transparent border-4 border-amber-600 border-l-6 border-r-6">
          {/* Маска для затемнения краев */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-5 rounded" />

          {/* Линия выигрыша */}
          <div className="absolute left-0 w-full h-1 bg-yellow-400/50 z-6 top-1/2 -translate-y-1/2 shadow-glow" />

          {/* Внутренняя часть барабана */}
          <div
            ref={drumInnerRef}
            className="absolute top-0 left-0 w-full transition-transform duration-5000"
            style={{ transform: 'translateY(0px)' }}
          >
            {[...Array(6)].flatMap(() =>
              prizes.map((prize, index) => (
                <div
                  key={`${prize.name}-${index}`}
                  className={`h-14 flex items-center px-4 font-bold text-white border-b border-white/20 text-shadow ${prize.type === 'premium'
                    ? 'bg-gradient-to-r from-red-500/70 to-yellow-500/70'
                    : index % 2 === 0
                      ? 'bg-blue-500/70'
                      : 'bg-blue-700/70'
                    }`}
                >
                  {prize.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Правый указатель */}
        <div className="w-8 h-14 bg-gradient-to-l from-red-500 to-pink-500 clip-triangle-right z-10 shadow-lg ml-[-4px] rounded-l" />
      </div>

      {/* Кнопка с неоновым мерцанием */}
      <div className="w-full flex flex-col items-center mb-20">
        <button
          className="btn p-8 glass w-full mt-4 text-center bg-secondary/50 border-2 border-yellow-400/50 hover:border-yellow-300/70 transition-all duration-300 neon-button"
          onClick={spinDrum}
          disabled={isSpinning}
        >
          <p className="text-2xl font-extrabold neon-text relative z-10">
            {isSpinning ? "Барабан вращается..." : result}
          </p>
        </button>
      </div>

      <style jsx>{`
        .clip-triangle-left {
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
        .clip-triangle-right {
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
        }
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        .shadow-glow {
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        .neon-text {
          color: #ffffff;
          text-shadow: 
            0 0 2px #fff,
            0 0 4px #fff,
            0 0 6px #fff,
            0 0 8px #ff0,
            0 0 12px #ff0,
            0 0 16px #ff0;
          animation: neon-flicker 1.5s ease-in-out infinite alternate;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        .neon-button {
          box-shadow: 
            0 0 3px rgba(255, 255, 255, 0.4),
            0 0 6px rgba(255, 215, 0, 0.4),
            0 0 9px rgba(255, 215, 0, 0.3);
          animation: neon-border 2s ease-in-out infinite alternate;
          position: relative;
          overflow: hidden;
        }
        .neon-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
          animation: neon-shine 3s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes neon-flicker {
          0%, 100% {
            text-shadow: 
              0 0 2px #fff,
              0 0 4px #fff,
              0 0 6px #fff,
              0 0 8px #ff0,
              0 0 12px #ff0,
              0 0 16px #ff0;
            opacity: 1;
          }
          50% {
            text-shadow: 
              0 0 1px #fff,
              0 0 2px #fff,
              0 0 3px #fff,
              0 0 4px #ff0,
              0 0 6px #ff0,
              0 0 8px #ff0;
            opacity: 0.9;
          }
        }
        @keyframes neon-border {
          0% {
            box-shadow: 
              0 0 3px rgba(255, 255, 255, 0.4),
              0 0 6px rgba(255, 215, 0, 0.4),
              0 0 9px rgba(255, 215, 0, 0.3);
          }
          100% {
            box-shadow: 
              0 0 6px rgba(255, 255, 255, 0.6),
              0 0 12px rgba(255, 215, 0, 0.6),
              0 0 18px rgba(255, 215, 0, 0.5);
          }
        }
        @keyframes neon-shine {
          0% {
            transform: rotate(0deg) translate(-25%, -25%);
          }
          100% {
            transform: rotate(360deg) translate(-25%, -25%);
          }
        }
      `}</style>
    </div>
  );
}