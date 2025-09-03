import { useState, useEffect, useRef } from 'react'
import backgroundImg from './assets/images/clock-background.png'
import './App.css'

function App() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Base dimensions for scaling
  const baseWidth = 1920;
  const baseHeight = 1200;
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);

  // Update scale based on viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate scale factors for width and height
      const widthScale = viewportWidth / baseWidth;
      const heightScale = viewportHeight / baseHeight;

      // Use the smaller scale factor to ensure content fits
      const newScale = Math.min(widthScale, heightScale);

      // Update scale state
      setScale(newScale);
    };

    // Set initial scale
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set a target date in the future
    const targetDate = new Date('2025-11-15T00:00:00')

    const updateCountdown = () => {
      const currentDate = new Date()
      const timeDifference = targetDate - currentDate

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }

    // Update the countdown immediately
    updateCountdown()

    // Update the countdown every second
    const intervalId = setInterval(updateCountdown, 1000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  // Format numbers to have two digits
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-[Inter] bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImg}
          alt="Clock Background"
          className="w-full h-full object-center"
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          gap: '0rem', // Gap between elements
          marginTop: `${92 * scale}px` // Base margin of 92px (mt-23) that scales with screen size
        }}
      >
        {/* Main Title */}
        <h1 className="title-text">
          PHỤNG SỰ & PHÁT TRIỂN
        </h1>

        {/* Countdown Numbers */}
        <div className="countdown-text">
          {formatNumber(time.days)} <span className="blink-effect">:</span> {formatNumber(time.hours)} <span className="blink-effect">:</span> {formatNumber(time.minutes)} <span className="blink-effect">:</span> {formatNumber(time.seconds)}
        </div>

        {/* Labels */}
        <div className="labels-container">
          <div className="label-text">NGÀY</div>
          <div className="label-text">GIỜ</div>
          <div className="label-text">PHÚT</div>
          <div className="label-text">GIÂY</div>
        </div>
      </div>
    </div>
  )
}

export default App
