import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dock from "./components/layout/footer/Dock";
import Home from "./components/pages/Home";
import Header from "./components/layout/footer/Header";
import backgroundUrl from "./assets/hero-pic.jpg";
import FortuneDrum from "./components/pages/Fortune";

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

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.disableVerticalSwipes();
      window.Telegram.WebApp.setHeaderColor('#2b2d31');
    }
  }, []);

  return (
    <div
      className="min-h-[100dvh] flex flex-col bg-cover bg-center bg-no-repeat bg-fixed relative
                 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b 
                 before:from-white/80 before:to-transparent"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="relative z-10 flex flex-col min-h-full">
        <Header entrantID="23456" />

        <main className="flex-1 flex justify-center overflow-auto">
          <div className="w-full max-w-md flex flex-col items-center py-4">
            {tab === "main" && <Home targetDate={datePrizeDraw} />}
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
          isStaff={isStaff}
        />
      </div>
    </div>
  );
}

export default App;