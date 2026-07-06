import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Header from "../../ui/Header";
import {
  ArrowDown,
  SlidersHorizontal,
  ArrowUpRight,
  Check,
  Eye,
} from "lucide-react";

const Home = () => {
  const products = useSelector((state) => state.product.products) || [];
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("ALL");
  const marqueeRef = useRef(null);
  const cardsRef = useRef([]);
  const sectionTitleRef = useRef(null);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // GSAP Infinite Horizontal Scroll for Marquee Banner
  useEffect(() => {
    if (marqueeRef.current) {
      const items = marqueeRef.current.querySelectorAll(".marquee-item");
      gsap.to(items, {
        xPercent: -100,
        repeat: -1,
        duration: 25,
        ease: "linear",
      });
    }
  }, [products]);

  // GSAP Stagger Entrance for Product Cards & Section Headings
  useEffect(() => {
    if (products && products.length > 0) {
      const activeCards = cardsRef.current.filter(Boolean);
      if (activeCards.length > 0) {
        gsap.fromTo(
          activeCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      }
    }

    if (sectionTitleRef.current) {
      const items = sectionTitleRef.current.children;
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power3.out" },
      );
    }
  }, [products, activeCategory]);

  // Filter products based on active category selection
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "ALL") return true;
    const cat = product.category?.trim().toUpperCase() || "";
    return cat.includes(activeCategory);
  });

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-black/10 bg-[#f9f9f7] text-[#1a1c1b]"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {/* Main Hero Header Section */}
        <Header />

        {/* ── Sticky Category & Filter Bar ── */}
        <div className="sticky top-[73px] z-30 bg-[#f9f9f7]/95 backdrop-blur-md border-b border-[#e2e3e1] py-4 select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {["ALL", "STREETWEAR", "ESSENTIALS", "OUTERWEAR"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-[9px] tracking-widest transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-black text-white"
                      : "bg-[#eeeeec] text-[#4c4546] hover:bg-[#e2e3e1]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sizes & Filters */}
            <div className="flex gap-4 items-center w-full sm:w-auto justify-end">
              <button className="flex items-center gap-2 font-bold text-[9px] tracking-widest border border-[#7e7576]/30 px-5 py-2 rounded-full hover:border-black transition-colors cursor-pointer bg-white">
                SIZE <ArrowDown size={10} />
              </button>
              <button className="flex items-center gap-2 font-bold text-[9px] tracking-widest border border-[#7e7576]/30 px-5 py-2 rounded-full hover:border-black transition-colors cursor-pointer bg-white">
                PRICE <ArrowDown size={10} />
              </button>
              <SlidersHorizontal
                size={14}
                className="text-[#1a1c1b] cursor-pointer hover:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Main Storefront Grid Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24">
          {/* Section: Title Header */}
          <div ref={sectionTitleRef} className="pb-12 text-left space-y-2">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#536255]">
              CURATED FOR YOU
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight uppercase text-black">
              Trending Now
            </h2>
          </div>

          {/* Section: Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <div
                id="shop-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 pb-24"
              >
                {filteredProducts.map((product, idx) => {
                  const hasMultipleImages =
                    product.images && product.images.length > 1;
                  const primaryImage =
                    product.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400";
                  const hoverImage = hasMultipleImages
                    ? product.images[1].url
                    : primaryImage;

                  return (
                    <div
                      ref={(el) => (cardsRef.current[idx] = el)}
                      onClick={() => navigate(`/product/${product._id}`)}
                      key={product._id}
                      className="group cursor-pointer flex flex-col opacity-0 outline-none focus:outline-none"
                    >
                      {/* Image container - Sharp corners layout */}
                      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-none bg-[#eeeeec]">
                        {/* Primary Image */}
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="main-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        />
                        {/* Hover Image swap */}
                        {hasMultipleImages && (
                          <img
                            src={hoverImage}
                            alt={product.title}
                            className="hover-img absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                          />
                        )}

                        {/* Quick View Button */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <span className="bg-white text-black px-6 py-3 font-bold text-[9px] tracking-widest uppercase hover:bg-black hover:text-white transition-all shadow-md inline-block">
                            QUICK VIEW
                          </span>
                        </div>

                        {/* Status Tag */}
                        {idx === 0 && (
                          <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 font-bold text-[8px] tracking-widest uppercase border">
                            NEW
                          </div>
                        )}
                        {idx === 2 && (
                          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-bold text-[8px] tracking-widest uppercase">
                            BESTSELLER
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex flex-col gap-1 px-1">
                        <h3 className="text-sm font-semibold tracking-tight text-black group-hover:underline truncate">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#4c4546] font-normal">
                          {product.price?.currency}{" "}
                          {product.price?.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <p className="text-sm text-[#4c4546] mb-4">
                  No garments found under this category.
                </p>
                <button
                  onClick={() => setActiveCategory("ALL")}
                  className="px-6 py-2 border border-black font-bold text-[9px] tracking-widest"
                >
                  VIEW ALL
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* ── High-End Marquee Divider ── */}
          <div
            className="w-full py-8 border-y overflow-hidden whitespace-nowrap bg-black text-white select-none pointer-events-none mb-20"
            style={{ borderColor: "#1a1c1b" }}
          >
            <div
              ref={marqueeRef}
              className="flex gap-16 w-max uppercase text-[10px] font-bold tracking-[0.3em]"
            >
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="marquee-item flex gap-16 items-center shrink-0"
                >
                  <span>DESIGNED FOR THE MODERN NOMAD</span>
                  <span className="text-[#C9A96E]">•</span>
                  <span>BESPOKE SILHOUETTES</span>
                  <span className="text-[#C9A96E]">•</span>
                  <span>ARCHITECTURAL PROPORTIONS</span>
                  <span className="text-[#C9A96E]">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Interactive Brand Narrative (Stitch Nomad Story) */}
          <div
            id="atelier-showcase"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#f4f4f2] p-8 md:p-12"
          >
            <div className="lg:col-span-7 rounded-none overflow-hidden aspect-[4/5] md:aspect-[16/10] bg-black shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpv-oEEYjrxDDQT-9edGyUZ77FA020qg5por3ftvqwqZANUWsZwjahzmdylDpmcSRNrQFZozWaJupcSPqFXhxgh4RpGScygHIRMHK9oZxy7Hyz3sSf1NDDp_PAiD6J73HjDcwKnY8lvmDAqdV93kfEYVz_NkdjEVeTXEq18Yv6qI4B5VfLjp5yWtXFZUZ5jVevax4nu2fKPGp7HVCS5Nh0pWSG7ZpUZX44rsHNBFmw9XzknIpsUo-q4A"
                alt="Designed for the Modern Nomad Story"
                className="w-full h-full object-cover transition-transform duration-[2.5s] hover:scale-102"
              />
            </div>

            <div className="lg:col-span-5 space-y-6 lg:pl-6 text-left flex flex-col justify-center items-start">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#536255] block">
                THE EDITORIAL
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight text-black">
                Designed for the <br /> Modern Nomad
              </h3>
              <p className="text-xs text-[#4c4546] leading-relaxed font-normal max-w-md">
                Our pieces are crafted to transition seamlessly between
                environments. We prioritize architectural silhouettes and
                technical fabrics that provide both comfort and a sharp
                aesthetic edge.
              </p>

              <button
                onClick={() => navigate("/menu")}
                className="bg-black text-white hover:bg-white hover:text-black hover:border-black border border-transparent px-10 py-4 font-bold text-[9px] uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                READ THE STORY
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
