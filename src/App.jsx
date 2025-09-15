import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dock from "./components/layout/footer/Dock";
import Home from "./components/pages/Home";
import Header from "./components/layout/footer/Header";
import backgroundUrl from "./assets/hero-pic.jpg";
import FortuneDrum from "./components/pages/Fortune";
import GetContact from "./components/pages/GetContact";
import WarningWindow from "./components/pages/WarningWindow";
import { useUserData } from "./hooks/useUserData"; 

const API_BASE = 'https://tbcata-95-158-216-233.ru.tuna.am/api/v1/users';

function App() {
  const datePrizeDraw = new Date("2025-09-25T15:30:00");
  const [tab, setTab] = useState("main");
  const [count, setCount] = useState(0);
  const isStaff = false;
  const counter = 10;
  const prizes = [
    { name: "Главный приз", type: "premium" },
    { name: "Скидка 20%", type: "regular" },
    { name: "Бесплатная доставка", type: "regular" },
    { name: "Подарок", type: "premium" },
    { name: "10% скидка", type: "regular" },
    { name: "Фирменный сувенир", type: "regular" },
    { name: "Двойной бонус", type: "regular" },
    { name: "50% скидка", type: "premium" },
    { name: "Удача в следующий раз", type: "regular" },
    { name: "Малый приз", type: "regular" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const {
    userData,
    tickets,
    status,
    requiredChannels,
    showModal,
    loading: userDataLoading,
    error: userDataError,
    fetchUserData,
    setShowModal
  } = useUserData();

  useEffect(() => {
    const initData = window.Telegram.WebApp.initData;
    if (initData) {
      window.Telegram.WebApp.expand();
      parseInitData(initData);
    } else {
      setShowModal(false);
      setShowWarning(true);
    }
  }, []);

  const parseInitData = async (initDataString) => {
    try {
      const urlParams = new URLSearchParams(initDataString);
      const userParam = urlParams.get('user');

      if (userParam) {
        const tg_user = JSON.parse(decodeURIComponent(userParam));
        console.log('tg data:', tg_user);
        
        // Передаем tg_user в хук для загрузки данных
        await fetchUserData(tg_user);
      }
    } catch (err) {
      console.error('Error parsing initData:', err);
    }
  };

  const handleGetContacts = () => {
    console.log('handleGetContacts called');

    if (!window.Telegram?.WebApp) {
      console.error('Telegram WebApp not available');
      alert('Функция доступна только в Telegram');
      return;
    }

    console.log('Telegram WebApp available:', window.Telegram.WebApp);
    setIsLoading(true);

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.requestContact((contactData) => {
        setIsLoading(false);
        if (contactData) {
          console.log('Контакты получены:', contactData);
          setShowModal(false);
          
          // После получения контактов можно обновить данные пользователя
          if (userData?.id) {
            fetchUserData({ id: userData.id }); // Обновляем данные
          }
        }
      });
    }
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  // Показываем загрузку если данные еще грузятся
  if (userDataLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Показываем ошибку если есть
  if (userDataError) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="alert alert-error">
          <span>Ошибка загрузки данных: {userDataError}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col bg-cover bg-center bg-no-repeat bg-fixed relative
                 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b 
                 before:from-white/80 before:to-transparent"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <WarningWindow showWarning={showWarning} />
      <div className="relative z-10 flex flex-col min-h-full">
        <Header entrantID={userData?.entrant_id} tickets={tickets} status={status}/>

        <main className="flex-1 flex justify-center overflow-auto">
          <div className="w-full max-w-md flex flex-col items-center py-4">
            {tab === "main" && <Home targetDate={datePrizeDraw} userUIID={userData?.user_uuid}/>}
            {tab === "help" && (
              <div className="bg-base-200 bg-opacity-90 rounded-lg p-8 backdrop-blur-sm">
                Help Content
              </div>
            )}
            {tab === "settings" && (
              <div className="bg-base-200 bg-opacity-90 rounded-lg p-8 backdrop-blur-sm">
                Settings Content
              </div>
            )}
            {tab === "fortune" && <FortuneDrum prizes={prizes} />}
          </div>
        </main>

        <Dock
          activeTab={tab}
          onChange={(current) => setTab(current)}
          isStaff={userData?.isStaff}
        />
      </div>
      <GetContact
        showModal={showModal}
        isLoading={isLoading}
        onGetContacts={handleGetContacts}
        onSkip={handleSkip} />
    </div>
  );
}

export default App;