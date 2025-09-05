import { useState, useEffect, useRef } from 'react'
import backgroundImg from './assets/images/new/bg4.png'
import logoImg from './assets/images/new/logo.png'
import './App.css'
import './assets/fonts/digital-font.css'

function App() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const contentRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Handle image loading
  useEffect(() => {
    const images = [backgroundImg, logoImg];
    let loadedCount = 0;

    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    }).catch(err => {
      console.error('Error loading images:', err);
      // Still show content even if image loading fails
      setImagesLoaded(true);
    });
  }, []);

  // Update orientation based on viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Detect orientation
      const newOrientation = viewportWidth > viewportHeight ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    };

    // Set initial values
    handleResize();

    // Add event listeners for window resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    // Set a target date in the future
    const targetDate = new Date('2025-11-15T00:00:00')

    const updateCountdown = () => {
      const now = new Date()
      const timeDifference = targetDate - now

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

  // Separate effect for real-time clock updates
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentDate(new Date())
    }

    // Update the current time immediately
    updateCurrentTime()

    // Update the current time every second
    const intervalId = setInterval(updateCurrentTime, 1000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  // Format numbers to have two digits
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    const day = formatNumber(date.getDate());
    const month = formatNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-cyan-400 text-lg">Đang tải...</p>
      </div>
    </div>
  )

  return (
    <>
      {!imagesLoaded && <LoadingIndicator />}

      <div className="relative w-full h-screen overflow-hidden font-[Montserrat] bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImg}
            alt="Clock Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10 p-4 md:p-8">
          <div className={`w-full max-w-[1020px] mx-auto ${orientation === 'landscape' ? 'flex flex-col items-center' : ''}`}>
            {/* Logo */}
            <div className={`flex justify-center ${orientation === 'portrait' ? 'mb-6 md:mb-10' : 'mr-6 md:mr-10 flex-shrink-0'}`}>
              <img
                src={logoImg}
                alt="Logo"
                className={`w-auto h-auto ${orientation === 'portrait' ? 'max-h-[380px] md:max-h-[510px]' : 'max-h-[210px] md:max-h-[340px]'}`}
              />
            </div>

            {/* Content Panel */}
            <div className={`countdown-panel ${orientation === 'landscape' && 'flex-grow'}`}>
              {/* Countdown Content */}
              <div
                ref={contentRef}
                className="relative flex flex-col items-center justify-center p-2 md:p-4"
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

            <div className="mt-6 md:mt-10 text-center">
              <h2 className="flex flex-col space-y-1 md:space-y-2 gradient-border pt-2 md:pt-4">
                <span className="anniversary-text  text-[#f3a734]">HƯỚNG TỚI KỶ NIỆM 80 NĂM NGÀY THÀNH LẬP TRƯỜNG</span>
                <span className="anniversary-date-text text-[#f3a734]">(15/11/1945-15/11/2025)</span>
              </h2>
            </div>
            <div className="mt-1 md:mt-7 text-center">
              <h2 className="space-y-1 md:space-y-2 pt-2 md:pt-0">
                <span className="current-time-text text-[#ffffff] text-2xl md:text-3xl font-bold">BÂY GIỜ LÀ: </span>
                <span className="current-time-date-text text-[#a4ffff] text-3xl md:text-4xl lg:text-5xl font-bold">{formatNumber(currentDate.getHours())}:{formatNumber(currentDate.getMinutes())}:{formatNumber(currentDate.getSeconds())}-{formatDate(currentDate)}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
