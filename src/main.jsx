import { StrictMode, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import './fonts.css';
import logo from './assets/logo_amerta_by_kartini.png'
import AboutUs from "./AboutUs.jsx";
import OrderSteps from "./OrderSteps.jsx";
import ContactUs from "./ContactUs.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Carousel from "./Carousel.jsx";
import Review from "./Review.jsx";
import Catalogue from "./Catalogue.jsx";

const App = () => {
  const scrollContainerRef = useRef(null);
  const [fakeScrollY, setFakeScrollY] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [ballHidden, setBallHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleTap = () => {
    if (isMobile && !scrollEnabled && !isAnimating) {
      setIsAnimating(true);
      
      const interval = setInterval(() => {
        setFakeScrollY((prev) => {
          const newScrollY = Math.min(prev + 20, window.innerHeight * 2);
          if (newScrollY >= window.innerHeight * 1.9) {
            clearInterval(interval);
            setBallHidden(true);
            setScrollEnabled(true);
            setIsAnimating(false);
          }
          return newScrollY;
        });
      }, 16);
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current || isAnimating) return; // Prevent error if ref is not ready
    let touchStartY = 0; 
    const handleScroll = (e) => {
      
      if (!scrollEnabled && !isMobile) {
          setIsAnimating(true);
          const interval = setInterval(() => { // Animation is auto, idk i think its better for consistency
            setFakeScrollY((prev) => {
              const newScrollY = Math.min(prev + 20, window.innerHeight * 2);
              if (newScrollY >= window.innerHeight * 1.9) {
                clearInterval(interval);
                setScrollEnabled(true);
                setBallHidden(true);
                setTimeout(() => {
                  setIsAnimating(false);
                }, 1000);
              }
              return newScrollY;
            });
        }, 16); // Slowed down here abit
      }
      /*
        if (prevY > 0) { // Scroll down
          setFakeScrollY((prev) => {
            const newScrollY = Math.min(prev + 40, window.innerHeight * 2);
            if (newScrollY >= window.innerHeight * 1.9) {
              setBallHidden(true);
              setScrollEnabled(true);
            }
            return newScrollY;
          });
        } else if (prevY < 0) { //Scroll up
          setFakeScrollY((prev) => {
            const newScrollY = Math.max(prev - 40, 0);
            return newScrollY;
          });
        }
      }
      
      */
    
    };  

    const handleReverseScroll = (event) => {
      if(isAnimating) return;
      if (scrollEnabled && scrollContainerRef.current && !isAnimating) {
        if (scrollContainerRef.current.scrollTop === 0 && event.deltaY < 0) {
    
        setScrollEnabled(false);
        setBallHidden(false);
        setFakeScrollY(window.innerHeight * 1.9);
        setIsAnimating(true);
    
        const interval = setInterval(() => {
          setFakeScrollY((prev) => {
            const newScrollY = Math.max(prev - 20, 0);
            if (newScrollY <= 0) {
              clearInterval(interval);
              setTimeout(() => {
                setIsAnimating(false);
              }, 1000);
            }
            return newScrollY;
          });
        }, 16);
      }
    }
    };

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
    };
    const handleTouchMove = (event) => {
      if (isAnimating) return;

      const touchEndY = event.touches[0].clientY;
      const swipeDistance = touchEndY - touchStartY;

      if (swipeDistance > 30 && scrollContainerRef.current.scrollTop === 0) {  
        setScrollEnabled(false);
        setBallHidden(false);
        setFakeScrollY(window.innerHeight * 1.9);
        setIsAnimating(true);

        const interval = setInterval(() => {
          setFakeScrollY((prev) => {
            const newScrollY = Math.max(prev - 20, 0);
            if (newScrollY <= 0) {
              clearInterval(interval);
              setTimeout(() => {
                setIsAnimating(false);
              }, 1000);
            }
            return newScrollY;
          });
        }, 16);
      }
    };

    if (isMobile) {
      scrollContainerRef.current.addEventListener("touchstart", handleTouchStart, { passive: false });
      scrollContainerRef.current.addEventListener("touchmove", handleTouchMove, { passive: false });
      
    }
    
    window.addEventListener("wheel", handleScroll, { passive: false });

    if (scrollContainerRef.current) {
        scrollContainerRef.current.addEventListener("wheel", handleReverseScroll);
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
      scrollContainerRef.current.removeEventListener("touchstart", handleTouchStart);
      scrollContainerRef.current.removeEventListener("touchmove", handleTouchMove);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("wheel", handleReverseScroll);
      }
    };
  }
, [scrollEnabled, isMobile, isAnimating]);

  return (
    <>
      {/* Expanding Ball Animation */}
      {!scrollEnabled || !ballHidden ? (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center bg-[#E3E2DD] z-[60] p-4"
        style={{
          maskImage: `radial-gradient(circle ${fakeScrollY}px at 50% 50%, transparent 50%, black 40%)`,
          cursor: isMobile ? "pointer" : "default"
        }}
        onClick={handleTap}
      >
        <img className="h-10 mb-1 md:mb-4" src={logo} />
        <h1 className="z-[60] text-[#302F2B] text-center text-4xl md:text-6xl montserrat">
          Your forever moment, forever yours.
        </h1>
        <div className="mt-6 md:mt-10 animate-bounce">
          {isMobile ? (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <circle cx="12" cy="12" r="8" className="animate-pulse"/>
              </svg>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className="h-8 w-8 text-[#302F2B]"
            >
              <path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z" />
            </svg>
          )}
        </div>
      </div>
      ) : null}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className={`scroll-container h-screen relative ${
          scrollEnabled ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <Header />
        <Carousel />
        <AboutUs />
        <Review />
        <Catalogue/>
        <div className="w-full pt-4 pb-4 text-2xl md:text-4xl font-extrabold playfair-display text-white [text-shadow:_0px_4px_4px_rgba(0,0,0,0.25)] text-center bg-[#A5D2CF]">
          <p className="montserrat">Let's make your event one of a kind!</p>
        </div>
        <OrderSteps />
        <ContactUs />
        <Footer />
      </div>
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);