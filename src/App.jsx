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

const API_BASE = 'https://hfi3kh-95-158-216-233.ru.tuna.am/api/v1/users';

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

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [tickets, setTickets] = useState(0);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const initData = window.Telegram.WebApp.initData;
    if (initData) {
      window.Telegram.WebApp.expand();
      parseInitData(initData);
    }
    else {
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

        const userUrl = `${API_BASE}?tg_user_id=${tg_user.id}`;
        const ticketsUrl = `${API_BASE}/tickets?tg_user_id=${tg_user.id}`;
        const statusUrl = `${API_BASE}/status?tg_user_id=${tg_user.id}`;

        const [userResponse, ticketsResponse, statusResponse] = await Promise.all([
          fetch(userUrl),
          fetch(ticketsUrl),
          fetch(statusUrl)
        ]);

        const user = userResponse.ok ? (await userResponse.json()) : null;
        const userTickets = ticketsResponse.ok ? (await ticketsResponse.json()).tickets : 0;
        const userStatus = statusResponse.ok ? (await statusResponse.json()).status : 'unknown';
        setUserData({
          id: tg_user.id,
          firstName: tg_user.first_name,
          lastName: tg_user.last_name,
          username: tg_user.username,
          language_code: tg_user.language_code,
          entrant_id: user?user.entrant_id:null,
          phone_number: user?user.phone_number:null,
          last_activity: user?user.last_activity:null,
          user_uuid: user?user.user_uuid:null,
          is_staff: user?user.is_staff:null,
          is_admin: user?user.is_admin:null,
        });
        setStatus(userStatus);
        setTickets(userTickets);
        if (!user?.phone_number) {
          console.log('handleGetContacts enable');
          setShowModal(true);
        }
        console.log('tg data:', tg_user)
        console.log('db data:', user)
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
      window.Telegram.WebApp.requestContact(
        (contactData) => {
          setIsLoading(false);
          if (contactData) {
            console.log('Контакты получены:', contactData);
            setShowModal(false);
          }
        }
      );
    }
  };

  const handleSkip = () => {
    setShowModal(false);
  };

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