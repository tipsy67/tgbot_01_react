import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dock from './components/layout/footer/Dock'
import Home from './components/pages/Home'
import Header from './components/layout/footer/Header'
import backgroundUrl from './assets/hero-pic.jpg'

function App() {
  const datePrizeDraw = new Date('2025-09-25T15:30:00'); 
  const [tab, setTab] = useState('main')
  const [count, setCount] = useState(0)
  const isStaff = false
  const counter=10

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed relative
                 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b 
                 before:from-white/80 before:to-transparent"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="relative z-10 flex flex-col h-full">
      
      <Header entrantID='23456'/>
      
      <main className="flex-1 flex justify-center items-center overflow-auto p-4">
        <div className="w-full max-w-md">
          {tab === 'main' && <Home targetDate={datePrizeDraw}/>}
          {tab === 'help' && <div className="bg-base-200 bg-opacity-90 rounded-lg p-8 backdrop-blur-sm">Help Content</div>}
          {tab === 'settings' && <div className="bg-base-200 bg-opacity-90 rounded-lg p-8 backdrop-blur-sm">Settings Content</div>}
          {tab === 'fortune' && <div className="bg-base-200 bg-opacity-90 rounded-lg p-8 backdrop-blur-sm">Fortune Content</div>}
        </div>
      </main>

      <Dock activeTab={tab} onChange={(current) => setTab(current)} isStaff={isStaff}/>
    </div>
    </div>
  )
}

export default App
