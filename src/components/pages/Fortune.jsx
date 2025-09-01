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
      <h1 className="text-2xl font-bold text-white text-shadow mb-6">
        Барабан Фортуны
      </h1>
      
      {/* Контейнер барабана по центру */}
      <div className="flex justify-center items-center mb-6 w-full">
        {/* Указатель */}
        <div className="w-8 h-14 bg-gradient-to-r from-red-500 to-pink-500 clip-triangle z-10 shadow-lg mr-[-4px] rounded-l" />
        
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
                  className={`h-14 flex items-center px-4 font-bold text-white border-b border-white/20 text-shadow ${
                    prize.type === 'premium' 
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
      </div>
      
      {/* Кнопка и результат */}
      <div className="w-full flex flex-col items-center">
        {/* <button 
          className={`btn btn-primary glass ${isSpinning ? 'loading' : ''}`}
          onClick={spinDrum}
          disabled={isSpinning}
        >
          {isSpinning ? 'Вращается...' : 'Крутить барабан'}
        </button> */}
        
        <div className="mt-4 p-4 bg-black/40 rounded-lg w-full text-center border border-white/20 backdrop-blur-sm">
          <p className="text-xl font-bold text-yellow-300 transition-all duration-300">
            {result}
          </p>
        </div>
      </div>

      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        .shadow-glow {
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
      `}</style>
    </div>
  );
}