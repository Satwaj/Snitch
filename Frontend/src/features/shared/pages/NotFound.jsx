import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { MoveLeft, Search, Compass, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const backgroundTextRef = useRef(null);
  const floatingIconsRef = useRef([]);

  useEffect(() => {
    // GSAP slow parallax / floating effect on background text
    if (backgroundTextRef.current) {
      gsap.to(backgroundTextRef.current, {
        x: -40,
        y: -20,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // GSAP floating animation for decorative symbols
    floatingIconsRef.current.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-15, 15)",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      }
    });
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div
        className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-6 select-none bg-[#fbf9f6]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Large Decorative Background Text */}
        <div
          ref={backgroundTextRef}
          className="absolute -right-24 -top-24 md:-right-48 md:-top-48 text-[15rem] md:text-[30rem] font-light leading-none opacity-[0.02] pointer-events-none select-none text-[#1b1c1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          404
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            ref={(el) => (floatingIconsRef.current[0] = el)}
            className="absolute left-[15%] top-[25%] opacity-[0.08]"
          >
            <Compass size={48} className="text-[#C9A96E]" />
          </div>
          <div
            ref={(el) => (floatingIconsRef.current[1] = el)}
            className="absolute right-[20%] top-[30%] opacity-[0.08]"
          >
            <ShoppingBag size={56} className="text-[#C9A96E]" />
          </div>
          <div
            ref={(el) => (floatingIconsRef.current[2] = el)}
            className="absolute left-[25%] bottom-[20%] opacity-[0.08]"
          >
            <Search size={40} className="text-[#C9A96E]" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: "#C9A96E" }}
            >
              Archive Error
            </span>
            
            <h1
              className="text-6xl md:text-8xl font-light tracking-tight leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1b1c1a",
              }}
            >
              Lost in <br />
              <i className="italic">Transit</i>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "#7A6E63" }}
          >
            The piece or collection you are looking for has been archived, relocated, 
            or does not exist. Let us guide you back to our atelier.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-[#1b1c1a] hover:text-[#fbf9f6] active:scale-95 cursor-pointer"
              style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
            >
              <MoveLeft size={14} /> Go Back
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-opacity-90 active:scale-95 cursor-pointer"
              style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
            >
              Return to Shop
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="pt-12 text-[10px] uppercase tracking-widest"
            style={{ color: "#7A6E63" }}
          >
            Need help?{" "}
            <Link
              to="/track-order"
              className="underline transition-colors hover:text-[#C9A96E]"
            >
              Track your order
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
