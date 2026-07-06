import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const WelcomeLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lettersRef = useRef([]);
  const lineRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Check if already shown in session
    const hasLoaded = sessionStorage.getItem("snitch_welcome_loaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // GSAP Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("snitch_welcome_loaded", "true");
        setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }
    });

    // 1. Initial states
    gsap.set(lettersRef.current, { y: 60, opacity: 0 });
    gsap.set(lineRef.current, { scaleX: 0 });
    gsap.set(subtitleRef.current, { y: 25, opacity: 0 });
    gsap.set(imageRef.current, { scale: 1.15, opacity: 0 });

    // 2. Timeline sequence
    tl.to(imageRef.current, {
      opacity: 0.15,
      scale: 1.05,
      duration: 2.2,
      ease: "power2.out"
    })
    .to(lettersRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.06,
      ease: "power4.out",
    }, "-=1.8")
    .to(lineRef.current, {
      scaleX: 1,
      duration: 0.8,
      ease: "power2.inOut",
    }, "-=1.0")
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6")
    .to(lettersRef.current, {
      letterSpacing: "0.22em",
      duration: 1.4,
      ease: "power3.out",
    }, "-=0.8")
    .to([lettersRef.current, lineRef.current, subtitleRef.current, imageRef.current], {
      opacity: 0,
      y: (index, target) => target === imageRef.current ? 0 : -30,
      scale: (index, target) => target === imageRef.current ? 1.02 : 1,
      duration: 0.7,
      stagger: 0.05,
      ease: "power2.in",
    }, "+=0.3");

  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: "-100vh",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a09] text-white select-none pointer-events-none overflow-hidden"
        >
          {/* Subtle elegant grayscale background image */}
          <div
            ref={imageRef}
            className="absolute inset-0 z-0 bg-cover bg-center grayscale opacity-0 pointer-events-none select-none"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200')"
            }}
          />
          
          {/* Overlay vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] via-transparent to-[#0a0a09] z-10 opacity-95" />

          <div className="relative z-20 flex flex-col items-center max-w-md w-full px-6 text-center">
            {/* Logo letters */}
            <div className="flex overflow-hidden pb-2 select-none">
              {"SNITCH.".split("").map((char, index) => (
                <span
                  key={index}
                  ref={(el) => (lettersRef.current[index] = el)}
                  className="inline-block text-5xl md:text-7xl font-light uppercase tracking-normal"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: char === "." ? "#C9A96E" : "#f5f3f0"
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Separator line */}
            <div 
              ref={lineRef} 
              className="h-[1px] w-40 my-6 origin-center"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(245, 243, 240, 0.4) 50%, transparent 100%)"
              }}
            />

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#8c8275]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Curated Atelier / Modern Essentials
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLoader;
