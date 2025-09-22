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
import CheckSubscribe from "./components/pages/CheckSubscribe";
import TicketInfo from "./components/pages/TicketInfo";
import { useUserData } from "./hooks/useUserData";


function App() {
  const datePrizeDraw = new Date("2025-09-25T15:30:00");
  const [tab, setTab] = useState("main");
  const [count, setCount] = useState(0);
  const isStaff = false;
  const counter = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const {
    userData,
    tickets,
    status,
    requiredChannels,
    showModal,
    loading: userDataLoading,
    error: userDataError,
    fetchUserData,
    setShowModal,
    refreshData
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

          if (userData?.id) {
            fetchUserData({ id: userData.id });
          }
        }
      });
    }
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  const handleCheckSubscriptions = async () => {
    console.log('Checking subscriptions...');
    await refreshData();

    if (requiredChannels && requiredChannels.every(channel => channel.subscribe)) {
      setShowChannelsModal(false);
    }
  };

  const handleCloseChannelsModal = () => {
    setShowChannelsModal(false);
  };

  if (userDataLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

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
        <Header
          entrantID={userData?.entrant_id}
          tickets={tickets}
          onTicketsChange={() => setShowTicketModal(true)}
          status={status}
          onStatusChange={() => setShowChannelsModal(true)}
        />

        <main className="flex-1 flex justify-center overflow-auto">
          <div className="w-full max-w-md flex flex-col items-center py-4">
            {tab === "main" && <Home targetDate={datePrizeDraw} userUIID={userData?.user_uuid} />}
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
            {tab === "fortune" && <FortuneDrum tg_user={userData} />}
          </div>
        </main>

        <Dock
          activeTab={tab}
          onChange={(current) => setTab(current)}
          isStaff={userData?.is_staff}
        />
      </div>

      {/* Модальное окно для контактов */}
      <GetContact
        showModal={showModal}
        isLoading={isLoading}
        onGetContacts={handleGetContacts}
        onSkip={handleSkip}
      />

      {/* Модальное окно для подписок на каналы */}
      <CheckSubscribe
        showModal={showChannelsModal}
        channels={requiredChannels || []}
        onClose={handleCloseChannelsModal}
        onSubscribe={handleCheckSubscriptions}
      />
      
      {/* Модальное окно информации о билетах */}
      <TicketInfo
        tg_user={userData}
        showModal={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
}

export default App;