import  { useState, useEffect } from "react";

const Header = () => {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.pageYOffset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
            <main className="pt-16">
          <section className="relative w-full h-[75vh] md:h-[800px] overflow-hidden bg-black">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-85 scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1600')`,
                transform: `translateY(${scrollOffset * 0.3}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent z-10" />

            <div className="relative z-20 h-full flex flex-col justify-end items-start px-6 md:px-16 pb-16 max-w-7xl mx-auto text-white">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-accent-sage">
                LIMITED DROP / CURATED ARCHIVE
              </p>
              <h1 className="font-display text-4xl md:text-7xl font-extrabold leading-none tracking-tight mb-8 max-w-3xl">
                THE MODERN ARCHIVE <br /> COLLECTION
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const el = document.getElementById("shop-grid");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-lift bg-white text-black px-12 py-4 font-label text-xs uppercase tracking-widest font-bold cursor-pointer rounded-none border border-transparent hover:bg-black hover:text-white"
                >
                  Shop Capsule
                </button>
              </div>
            </div>
          </section>

        </main>
  )
}


export default Header
