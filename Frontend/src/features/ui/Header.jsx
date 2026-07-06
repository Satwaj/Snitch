import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const Header = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.pageYOffset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // GSAP Animation on mount
  useEffect(() => {
    // 1. Ken Burns background zoom
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.05, opacity: 1.0, duration: 2.2, ease: "power3.out" },
      );
    }

    // 2. Text elements slide and fade
    if (textRef.current) {
      const items = textRef.current.children;
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.4,
        },
      );
    }
  }, []);

  return (
    <main className="relative overflow-hidden pt-0">
      <section
        ref={heroRef}
        className="relative flex min-h-[88vh] w-full items-center overflow-hidden bg-[#0f1010] md:min-h-225"
      >
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 bg-cover bg-center origin-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1800')`,
            transform: `translateY(${scrollOffset * 0.25}px) scale(1.06)`,
            backgroundPosition: "center 18%",
          }}
        />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(201,169,110,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(180,196,180,0.18),transparent_24%),linear-gradient(180deg,rgba(7,8,8,0.18)_0%,rgba(7,8,8,0.62)_100%)]" />

        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:px-12 lg:flex-row lg:justify-end lg:items-end lg:gap-12 lg:py-24">
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="relative z-20 w-full max-w-3xl text-right lg:max-w-3xl lg:ml-auto"
          >
            <span className="hero-pop inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur">
              <ArrowUpRight size={12} className="text-[#C9A96E]" />
              Curated for modern dressing
            </span>

            <h1
              className="hero-pop mt-6 text-5xl font-medium leading-none tracking-tighter text-white md:text-7xl lg:text-8xl"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Quiet luxury.
              <br />
              Strong presence.
            </h1>

            <p className="hero-pop mt-5 max-w-xl text-[13px] leading-7 text-white/72 md:text-sm">
              A cinematic storefront built with depth, movement, and calm visual
              hierarchy. Discover the collection through soft parallax, layered
              light, and editorial pacing.
            </p>

            <div className="hero-pop mt-7 flex flex-wrap justify-end gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("shop-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[9px] font-bold uppercase tracking-[0.24em] text-black transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#C9A96E]"
              >
                Shop the edit
                <ArrowDown
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("atelier-showcase");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-[9px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
              >
                Explore the story
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Header;
