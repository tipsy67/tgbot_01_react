import React, { useState, useRef, useEffect } from 'react';
import { ENDPOINTS } from '../../constants/apiEndpoints';

export default function FortuneDrum({ tg_user, ...props }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('Жми!');
  const [prizes, setPrizes] = useState([]);
  const [winningPrize, setWinningPrize] = useState(null);
  const [initialPrizesLoaded, setInitialPrizesLoaded] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Добавляем ключ для принудительного ререндера
  const drumInnerRef = useRef(null);
  const apiUrl = ENDPOINTS.PRIZES(tg_user.id);

  // Загрузка начальных призов при монтировании компонента
  useEffect(() => {
    async function loadInitialPrizes() {
      try {
        const response = await fetch(`${apiUrl}&first_fetch=true`);
        if (!response.ok) throw new Error('Ошибка загрузки призов');
        
        const data = await response.json();
        const initialPrizes = data.prizes || [];
        const currentSpinsLeft = data.spins_left || 0
        
        setPrizes(initialPrizes);
        setSpinsLeft(currentSpinsLeft);        
        setInitialPrizesLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки начальных призов:', error);
        setInitialPrizesLoaded(true);
      }
    }

    loadInitialPrizes();
  }, [tg_user.id]);

  // Функция вращения барабана
  async function spinDrum() {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setResult("Барабан вращается...");
    setWinningPrize(null);
    setShowWinModal(false);

    try {
      const prizesResponse = await fetch(apiUrl);
      if (!prizesResponse.ok) throw new Error('Ошибка загрузки призов');
      
      const data = await prizesResponse.json();
      const currentPrizes = data.prizes || [];
      const currentSpinsLeft = data.spins_left || 0
      
      // Обновляем призы и принудительно запускаем ререндер
      setPrizes(currentPrizes);
      setSpinsLeft(currentSpinsLeft);
      setRenderKey(prev => prev + 1); // Изменяем ключ для принудительного ререндера

      if (currentPrizes.length === 0) {
        setResult("Нет призов");
        setIsSpinning(false);
        return;
      }
      
      const winningPrize = currentPrizes.find(prize => prize.bingo === true);
      
      if (!winningPrize) {
        setResult("Нет выигрышного приза");
        setIsSpinning(false);
        return;
      }

      setWinningPrize(winningPrize);
      const winningIndex = currentPrizes.findIndex(prize => prize.name === winningPrize.name);
      
      if (winningIndex !== -1) {
        animateDrum(winningIndex);
        // setSpinsLeft(prev => prev - 1);
        setTimeout(() => {
          setShowWinModal(true);
        }, 4100);
        setSpinsLeft(prev => prev - 1);

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

  // Правильная анимация барабана с точным попаданием на нужный приз
  function animateDrum(winningIndex) {
    if (prizes.length === 0) return;

    const itemHeight = 56;
    const totalItems = prizes.length;
    const drumHeight = 320;
    
    const pointerPosition = drumHeight / 2;
    const targetElementCenter = winningIndex * itemHeight + (itemHeight / 2);
    const targetPosition = targetElementCenter - pointerPosition;
    
    const fullCircles = 5;
    const totalOffset = (fullCircles * totalItems * itemHeight) + targetPosition;

    if (drumInnerRef.current) {
      drumInnerRef.current.style.transition = 'none';
      drumInnerRef.current.style.transform = 'translateY(0px)';
      
      setTimeout(() => {
        drumInnerRef.current.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        drumInnerRef.current.style.transform = `translateY(-${totalOffset}px)`;
      }, 50);

      setTimeout(() => {
        setResult("Жми!");
        setIsSpinning(false);
        setSpi()
      }, 4050);
    }
  }

  // Закрытие модального окна
  const closeModal = () => {
    winningPrize.quantity = winningPrize.quantity - 1
    setShowWinModal(false);
  };

  // Стили для разных типов призов
  const getPrizeStyle = (prize) => {
    if (prize.check_quantity && prize.quantity <= 0) {
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
        <p className="text-pink-300 text-sm mt-1 font-bold">
          Осталось попыток: {spinsLeft}
        </p>
        {!initialPrizesLoaded && (
          <p className="text-white/80 text-sm mt-1">
            Загрузка призов...
          </p>
        )}
      </div>

      {/* Контейнер барабана по центру */}
      <div className="flex justify-center items-center mb-4 w-full">
        <div className="w-8 h-14 bg-gradient-to-r from-red-500 to-pink-500 clip-triangle-left z-10 shadow-lg mr-[-4px] rounded-r" />

        <div className="relative w-70 h-80 overflow-hidden rounded-lg bg-transparent border-4 border-amber-600 border-l-6 border-r-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-5 rounded" />
          <div className="absolute left-0 w-full h-1 bg-yellow-400/50 z-6 top-1/2 -translate-y-1/2 shadow-glow" />

          {/* Добавляем key для принудительного ререндера при изменении призов */}
          <div
            ref={drumInnerRef}
            className="absolute top-0 left-0 w-full"
            style={{ transform: 'translateY(0px)' }}
            key={renderKey} // При изменении этого ключа компонент полностью перерисовывается
          >
            {[...Array(8)].flatMap((_, repetitionIndex) =>
              prizes.map((prize, index) => (
                <div
                  key={`${prize.name}-${index}-${repetitionIndex}-${renderKey}`} // Уникальный ключ с renderKey
                  className={`h-14 flex items-center justify-between px-4 font-bold text-white border-b border-white/20 text-shadow ${getPrizeStyle(prize)}`}
                >
                  <span className="text-sm">{prize.name}</span>
                  {prize.check_quantity && prize.quantity !== undefined && (
                    <span className="text-xs bg-black/40 px-2 py-1 rounded">
                      {prize.quantity} шт
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-8 h-14 bg-gradient-to-l from-red-500 to-pink-500 clip-triangle-right z-10 shadow-lg ml-[-4px] rounded-l" />
      </div>

      {/* Кнопка */}
      <div className="w-full flex flex-col items-center p-2 mb-20">
        <button
          className="btn p-6 glass w-full mt-4 text-center bg-secondary/50 border-2 border-yellow-400/50 hover:border-yellow-300/70 transition-all duration-300"
          onClick={spinDrum}
          disabled={isSpinning || !initialPrizesLoaded || spinsLeft <= 0}
        >
          <p className="text-xl font-bold text-white relative z-10">
            {isSpinning ? "Барабан вращается..." : spinsLeft > 0 ? result : "Попытки закончились"}
          </p>
        </button>
      </div>

      {/* Модальное окно с выигрышем */}
      {showWinModal && winningPrize && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg p-6 max-w-md w-full border-2 border-yellow-400 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Поздравляем!</h2>
              <p className="text-yellow-300 text-xl font-semibold mb-4">
                Вы выиграли: {winningPrize.name}
              </p>
              <button
                className="btn bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                onClick={closeModal}
              >
                Отлично!
              </button>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}