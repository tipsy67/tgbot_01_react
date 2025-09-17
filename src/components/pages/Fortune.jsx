import React, { useState, useRef, useEffect } from 'react';
import { ENDPOINTS } from '../../constants/apiEndpoints';

export default function FortuneDrum({ tg_user, ...props }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('Жми!');
  const [prizes, setPrizes] = useState([]);
  const [winningPrize, setWinningPrize] = useState(null);
  const [initialPrizesLoaded, setInitialPrizesLoaded] = useState(false);
  const drumInnerRef = useRef(null);
  const apiUrl = ENDPOINTS.PRIZES(tg_user.id);
  const firstUrl = ENDPOINTS.PRIZES(0);

  // Загрузка начальных призов при монтировании компонента
  useEffect(() => {
    async function loadInitialPrizes() {
      try {
        const response = await fetch(firstUrl);
        if (!response.ok) throw new Error('Ошибка загрузки призов');
        
        const data = await response.json();
        const initialPrizes = data.prizes || data;
        setPrizes(initialPrizes);
        setInitialPrizesLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки начальных призов:', error);
        setInitialPrizesLoaded(true);
      }
    }

    loadInitialPrizes();
  }, [firstUrl]);

  // Функция вращения барабана
  async function spinDrum() {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult("Барабан вращается...");
    setWinningPrize(null); // Сбрасываем предыдущий выигрыш

    try {
      // Загружаем призы по GET запросу
      const prizesResponse = await fetch(apiUrl);
      if (!prizesResponse.ok) throw new Error('Ошибка загрузки призов');
      
      const data = await prizesResponse.json();
      const currentPrizes = data.prizes || data;
      setPrizes(currentPrizes); // Обновляем призы

      if (currentPrizes.length === 0) {
        setResult("Нет призов");
        setIsSpinning(false);
        return;
      }

      // Находим приз с bingo: true
      const winningPrize = currentPrizes.find(prize => prize.bingo === true);
      
      if (!winningPrize) {
        setResult("Нет выигрышного приза");
        setIsSpinning(false);
        return;
      }

      // Сохраняем выигрышный приз
      setWinningPrize(winningPrize);

      // Находим индекс выигравшего приза
      const winningIndex = currentPrizes.findIndex(prize => prize.name === winningPrize.name);
      
      if (winningIndex !== -1) {
        animateDrum(winningIndex, winningPrize.name);
      } else {
        setResult("Ошибка приза");
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setResult("Ошибка соединения");
      setIsSpinning(false);
    }
  }

  // Анимация барабана как в старом коде
  function animateDrum(winningIndex, winningPrizeName) {
    if (prizes.length === 0) return;

    const itemHeight = 50; // Фиксированная высота элемента
    const totalHeight = prizes.length * itemHeight;
    const drumHeight = 300;

    const pointerPosition = drumHeight / 2;
    const targetPosition = winningIndex * itemHeight + (itemHeight / 2) - pointerPosition;

    // Количество оборотов как в старом коде
    const fullCircles = 3;
    const extraSpin = fullCircles * totalHeight;
    const totalOffset = extraSpin + targetPosition;

    if (drumInnerRef.current) {
      // Сбрасываем текущую позицию
      drumInnerRef.current.style.transition = 'none';
      drumInnerRef.current.style.transform = 'translateY(0px)';
      
      // Даем время для применения reset
      setTimeout(() => {
        // Используем easing функцию из старого кода
        drumInnerRef.current.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        drumInnerRef.current.style.transform = `translateY(-${totalOffset}px)`;
      }, 50);
    }

    setTimeout(() => {
      setResult(winningPrizeName);
      setIsSpinning(false);

      // Сброс как в старом кode
      setTimeout(() => {
        if (drumInnerRef.current) {
          drumInnerRef.current.style.transition = 'none';
          const currentPosition = totalOffset % totalHeight;
          drumInnerRef.current.style.transform = `translateY(-${currentPosition}px)`;
        }
      }, 100);
    }, 5000); // Время анимации как в старом коде
  }

  // Стили для разных типов призов
  const getPrizeStyle = (prize) => {
    if (winningPrize && prize.name === winningPrize.name) {
      return 'bg-gradient-to-r from-green-400/80 to-emerald-500/80 animate-pulse shadow-lg';
    } else if (prize.bingo) {
      return 'bg-gradient-to-r from-yellow-400/80 to-amber-500/80';
    } else if (prize.check_quantity && prize.quantity <= 0) {
      return 'bg-gradient-to-r from-gray-500/70 to-gray-600/70 text-gray-300';
    } else {
      return 'bg-gradient-to-r from-blue-500/70 to-purple-500/70';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Заголовок */}
      <div className="mb-2 p-4 bg-blue-50/40 rounded-lg w-full text-center border border-white/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white text-shadow">
          Барабан Фортуны
        </h1>
        {winningPrize && (
          <p className="text-green-300 text-sm mt-1 animate-pulse font-bold">
            🎉 ПОЗДРАВЛЯЕМ! Вы выиграли: {winningPrize.name}
          </p>
        )}
        {!initialPrizesLoaded && (
          <p className="text-white/80 text-sm mt-1">
            Загрузка призов...
          </p>
        )}
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
            className="absolute top-0 left-0 w-full"
            style={{ transform: 'translateY(0px)' }}
          >
            {[...Array(6)].flatMap(() => // Используем 6 повторений как в старом коде
              prizes.map((prize, index) => (
                <div
                  key={`${prize.name}-${index}-${Date.now()}`}
                  className={`h-14 flex items-center justify-between px-4 font-bold text-white border-b border-white/20 text-shadow ${getPrizeStyle(prize)}`}
                >
                  <span className="text-sm">{prize.name}</span>
                  {prize.check_quantity && prize.quantity !== undefined && (
                    <span className="text-xs bg-black/40 px-2 py-1 rounded">
                      {prize.quantity} шт
                    </span>
                  )}
                  {prize.bingo && (
                    <span className="text-xs bg-yellow-500/60 px-2 py-1 rounded">
                      ★
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Правый указатель */}
        <div className="w-8 h-14 bg-gradient-to-l from-red-500 to-pink-500 clip-triangle-right z-10 shadow-lg ml-[-4px] rounded-l" />
      </div>

      {/* Кнопка с неоновым мерцанием */}
      <div className="w-full flex flex-col items-center p-2 mb-20">
        <button
          className="btn p-8 glass w-full mt-4 text-center bg-secondary/50 border-2 border-yellow-400/50 hover:border-yellow-300/70 transition-all duration-300 neon-button"
          onClick={spinDrum}
          disabled={isSpinning || !initialPrizesLoaded}
        >
          <p className="text-2xl font-extrabold neon-text relative z-10">
            {isSpinning ? "Барабан вращается..." : result}
          </p>
        </button>
        
        {/* Статус призов */}
        {prizes.length > 0 && (
          <div className="mt-4 text-white/80 text-sm text-center">
            <div>Всего призов: {prizes.length}</div>
            <div className="text-yellow-300">
              Выигрышных: {prizes.filter(p => p.bingo).length}
            </div>
            <div>Доступно: {prizes.filter(p => !p.check_quantity || p.quantity > 0).length}</div>
          </div>
        )}
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