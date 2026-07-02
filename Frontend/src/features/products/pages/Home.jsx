import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router";

// ── Fallback Curated Products (matching the design system style) ──
const CURATED_PRODUCTS = [
  {
    _id: "curated_1",
    title: "Sage Heavyweight Hoodie",
    description: "An oversized, ultra-premium hoodie. Features double-lined hood, heavy cotton drape, and tonal clean stitching.",
    price: { currency: "USD", amount: 110 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADaKw0h5hvsCnFa5GVAWqv0OWJiDeEER5Q9nS031XXLotgmd8qF__Lp8tFvPt2SOTT6tWzPCD7pY0uzsGE47k3hAc7dunoPvnu64jqWqJ972LJmeNlOVmnXnKzAdsXHo2z0jjpaKOxPuhMCTFJNanJjckcCp0Yau8NNc-0H3cLtTTbGtliA-dr4xlQZR-lNe-ywPdCy73bWtp4ELFVXvpdmeOOo7Ilf8BX6Bm0RHJQWENBFgg8xzpiLg" }],
    category: "Streetwear",
    secondaryImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600"
  },
  {
    _id: "curated_2",
    title: "Stealth Cargo Trousers",
    description: "Tapered black cargos engineered with architectural silhouettes and premium technical water-repellent fabric.",
    price: { currency: "USD", amount: 145 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnymvr3rN-A2Ijz0WqNqpOMXBWDNeLupsLBHplp62pbEQX1LpKtSmvPYbxTHMOgsVUyI_NKwkKsMnP7GHvTNdDLYGBJZA93gpatGMcnEG9yW_TrWyYjqsYnm4ayKn0QeGhcKjX56sQMqf8iDXK-UKC8FshrqqEzlq23vzcSWMRfMwqrswIZkn3l88b2tKI0Tw81_LL2lnyCoZY0Swhpm2U0M9qW3vbNUzjUMWJzdzDC9hSibi4e98h9w" }],
    category: "Streetwear",
    secondaryImage: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600"
  },
  {
    _id: "curated_3",
    title: "Architect Linen Shirt",
    description: "Breathable textured white linen shirt. Perfectly structured for transition between professional and casual environments.",
    price: { currency: "USD", amount: 85 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbExq1b52hQoP3wOu9A5KzOphj3eC26qafdInmWf79_w7veWmuzhjcMpQPnm79eYclNjKJazZ9Cqj1KIc_kH1XYJ78yKkPksmBOutyuQNj51sJmpiuFs_3i9M1b2DSFlVCg1sDYkeX1pBkzsItOKCr_4IuX2Xq29ecqE5f-WMjYtkM_fPNB_sv3G7Fim3uPyXRzQTYrGhZB1Gk7F_F9PzU4_gxRMhrxqMZQO8XOTnOIOwUBBNGunOwQg" }],
    category: "Essentials",
    secondaryImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600"
  },
  {
    _id: "curated_4",
    title: "Essential Boxy Tee",
    description: "Classic loose fitting essential tee. Heavyweight organic cotton with sharp crew neck and a clean lookbook line.",
    price: { currency: "USD", amount: 55 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvnR3oHBpiZz1RNzq6Q3aFVrvpJ4gSLpHn0EgkZ421z6y-nTqt6FD88pINk51kICVBGuLZ-LTUCROrRSUXMwJjbJtraFeSdkT-M3EJBBT-2qBpoxcwvHQMujWrkrP3ZvYT39iJRhK5FajJlZDeV5BEvbh-giu2_Nc7KeZhvUpEQsMCFrYqEmpOrWb2IOf-Mp_8LDSim4BNUzcgEYkEqkJV3lYpkdGjRGqpYHWT2OLohcFyuQ1kFMeUlA" }],
    category: "Essentials",
    secondaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
  }
];

// ── Slider Checkout Component ──
const SliderCheckout = ({ onComplete, setCursorHovered }) => {
  const [position, setPosition] = useState(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const handleWidth = 48;
    const maxMove = trackWidth - handleWidth - 8;
    let move = clientX - startX.current;
    move = Math.max(0, Math.min(move, maxMove));
    setPosition(move);

    if (move >= maxMove - 5) {
      isDragging.current = false;
      setPosition(maxMove);
      onComplete();
    }
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setPosition(0);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMove(e.clientX);
    const handleGlobalMouseUp = () => handleEnd();

    if (isDragging.current) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging.current]);

  return (
    <div
      ref={trackRef}
      onMouseEnter={() => setCursorHovered(true)}
      onMouseLeave={() => setCursorHovered(false)}
      className="relative h-14 bg-surface-container rounded-full overflow-hidden flex items-center justify-center border border-outline/10 select-none cursor-pointer"
    >
      <span className="text-[10px] font-semibold tracking-[0.2em] text-primary opacity-50">
        {position > 150 ? "RELEASE TO ORDER" : "SLIDE TO CHECKOUT"}
      </span>
      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        style={{ transform: `translateX(${position}px)` }}
        className="absolute left-1 top-1 bottom-1 w-12 bg-primary text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </div>
    </div>
  );
};

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  // ── States ──
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("SAGE");
  const [toasts, setToasts] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  
  // Custom Cursor
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  // Parallax Scroll
  const [scrollOffset, setScrollOffset] = useState(0);

  // ── Effects ──
  useEffect(() => {
    handleGetAllProducts();

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ── Actions ──
  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAddToCart = (product, size = "M", color = "SAGE") => {
    setCart((prev) => [...prev, { ...product, selectedSize: size, selectedColor: color, cartId: Date.now() }]);
    triggerToast(`Added ${product.title} to bag`);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleCheckoutComplete = () => {
    triggerToast("Redirecting to secure checkout...");
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      triggerToast("Checkout Successful!");
    }, 1000);
  };

  // Combine fetched backend products with fallback assets
  const allDisplayProducts = [
    ...(products || []).map(p => ({ ...p, category: p.category || "Essentials" })),
    ...CURATED_PRODUCTS
  ];

  // Unique products by _id to avoid duplicates
  const uniqueProducts = [];
  const seenIds = new Set();
  for (const item of allDisplayProducts) {
    if (!seenIds.has(item._id)) {
      seenIds.add(item._id);
      uniqueProducts.push(item);
    }
  }

  // Filter products
  const filteredProducts = uniqueProducts.filter((product) => {
    const matchesSearch = searchQuery
      ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory === "ALL"
        ? true
        : product.category?.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Stylesheets & Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .nav-link-effect {
          position: relative;
        }
        .nav-link-effect::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background-color: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link-effect:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .btn-lift {
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 20px -10px rgba(0,0,0,0.15);
        }
        .btn-lift:active {
          transform: translateY(0px) scale(0.96);
        }
      `}</style>

      {/* ── Custom Cursor ── */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-primary mix-blend-difference transition-all duration-75 hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          width: cursorHovered ? "40px" : "8px",
          height: cursorHovered ? "40px" : "8px",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="fixed pointer-events-none z-[9998] rounded-full border border-outline/30 transition-all duration-150 hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          width: cursorHovered ? "56px" : "32px",
          height: cursorHovered ? "56px" : "32px",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className="min-h-screen text-on-surface bg-surface font-body selection:bg-secondary-container selection:text-on-secondary-container"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {/* ── Top Navigation Bar ── */}
        <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-surface-variant/30">
          <nav className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-7xl mx-auto">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="font-display text-2xl font-extrabold tracking-tighter text-primary cursor-pointer select-none"
            >
              SNITCH
            </div>

            {/* Desktop Navigation Link Toggles */}
            <div className="hidden md:flex gap-10 items-center">
              <span
                onClick={() => setSelectedCategory("ALL")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="nav-link-effect font-body-lg text-sm text-primary font-bold cursor-pointer"
              >
                Shop
              </span>
              <span
                onClick={() => setSelectedCategory("STREETWEAR")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="nav-link-effect font-body-lg text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Streetwear
              </span>
              <span
                onClick={() => setSelectedCategory("ESSENTIALS")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="nav-link-effect font-body-lg text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Essentials
              </span>
              <span
                onClick={() => setSelectedCategory("OUTERWEAR")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="nav-link-effect font-body-lg text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Outerwear
              </span>
            </div>

            {/* Trailing Icons */}
            <div className="flex items-center gap-6">
              {/* Search Control */}
              <div className="flex items-center">
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out border-b border-primary/20 mr-2 flex items-center ${
                    searchOpen ? "w-44 md:w-64 opacity-100 px-2" : "w-0 opacity-0"
                  }`}
                > 
                  <input
                    type="text"
                    placeholder="Search drops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full py-1 text-primary"
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="material-symbols-outlined text-primary hover:opacity-75 transition-opacity cursor-pointer leading-none"
                >
                  search
                </button>
              </div>

              {/* Seller portal link */}
              <button
                onClick={() => navigate("/seller/dashboard")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="material-symbols-outlined text-primary hover:opacity-75 transition-opacity cursor-pointer leading-none"
                title="Seller Dashboard"
              >
                person
              </button>

              {/* Shopping Cart count toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="material-symbols-outlined text-primary hover:opacity-75 transition-opacity cursor-pointer leading-none"
                >
                  shopping_bag
                </button>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white transition-all scale-100">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* ── Main Hero Section ── */}
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
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="btn-lift bg-white text-black px-12 py-4 font-label text-xs uppercase tracking-widest font-bold cursor-pointer rounded-none border border-transparent hover:bg-black hover:text-white"
                >
                  Shop Capsule
                </button>
              </div>
            </div>
          </section>

          {/* ── Filters & Category Bar ── */}
          <div className="sticky top-[64px] z-40 bg-surface/90 backdrop-blur-md border-b border-surface-variant/30 py-4 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Category selector pills */}
              <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto pb-1 md:pb-0">
                {["ALL", "STREETWEAR", "ESSENTIALS", "OUTERWEAR"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                    className={`px-6 py-2 rounded-full font-label text-[10px] tracking-widest cursor-pointer transition-all uppercase whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-primary text-white font-bold"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filter controls */}
              <div className="flex gap-4 items-center w-full md:w-auto justify-end">
                <div className="flex items-center gap-1 font-label text-[10px] tracking-widest border border-outline/20 px-4 py-2 rounded-full">
                  SIZE: M
                </div>
                <div className="flex items-center gap-1 font-label text-[10px] tracking-widest border border-outline/20 px-4 py-2 rounded-full">
                  CURRENCY: USD
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Product Section ── */}
          <section id="shop-grid" className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-outline/10 pb-4">
              <div>
                <p className="font-label text-xs tracking-widest text-secondary font-bold mb-1 uppercase">
                  Explore Curated Outfits
                </p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight">
                  Curated Catalog ({filteredProducts.length})
                </h2>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                {filteredProducts.map((product) => {
                  const hasImages = product.images && product.images.length > 0;
                  const primaryImageUrl = hasImages
                    ? product.images[0].url
                    : "/snitch_editorial_warm.png";
                  const secondaryImageUrl = product.secondaryImage || primaryImageUrl;

                  const isHovered = hoveredCardId === product._id;

                  return (

                    <div

                    onClick={() => navigate(`/product/${product._id}`)}
                      key={product._id}
                      className="group cursor-pointer flex flex-col relative"
                      onMouseEnter={() => {
                        setHoveredCardId(product._id);
                        setCursorHovered(true);
                      }}
                      onMouseLeave={() => {
                        setHoveredCardId(null);
                        setCursorHovered(false);
                      }}
                     
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] bg-surface-container overflow-hidden rounded-none mb-6">
                        <img
                          src={isHovered ? secondaryImageUrl : primaryImageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover transition-all duration-700 ease-out"
                        />
                        
                        {/* Quick View Button overlay */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="bg-white text-black font-label text-[10px] tracking-widest font-bold px-8 py-3.5 shadow-xl uppercase border-none transition-transform duration-300 translate-y-2 group-hover:translate-y-0 btn-lift"
                          >
                            Quick View
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display text-base font-semibold group-hover:text-secondary transition-colors duration-300">
                          {product.title}
                        </h3>
                        <p className="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-label text-xs font-bold text-primary tracking-widest">
                            {product.price?.currency || "$"}{" "}
                            {product.price?.amount?.toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant font-bold">
                            {product.category || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center">
                <span className="material-symbols-outlined text-5xl opacity-35 mb-4">search_off</span>
                <h3 className="text-xl font-bold mb-2">No Curated Fits Match</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  Try adjusting your search criteria or category filter to discover other options.
                </p>
              </div>
            )}
          </section>

          {/* ── Editorial Asymmetric Section ── */}
          <section className="bg-surface-container-low py-24 border-t border-b border-outline/10">
            <div className="max-w-7xl mx-auto px-6 md:px-16 grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200"
                    alt="Models walking in galleria"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]"
                  />
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col items-start md:pl-8">
                <span className="font-label text-xs text-secondary font-bold tracking-widest uppercase mb-4">
                  THE EDITORIAL EDIT
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                  Tailored for the Modern Nomad
                </h2>
                <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed">
                  Our outfits combine technical resilience with high-fashion aesthetics. We source organic, high-performance fabrics to construct silhouettes that feel comfortable and stand out cleanly in any setting.
                </p>
                <button
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="btn-lift border border-primary px-8 py-3.5 font-label text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-white"
                >
                  Read Lookbook
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="bg-surface border-t border-outline/10 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-center gap-8 text-center">
            <div className="font-display text-3xl font-extrabold tracking-tighter text-primary">
              SNITCH
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <span className="nav-link-effect text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                Privacy Policy
              </span>
              <span className="nav-link-effect text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                Terms of Service
              </span>
              <span className="nav-link-effect text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                Sustainability Commitment
              </span>
              <span className="nav-link-effect text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                Store Locations
              </span>
            </div>
            <p className="font-body text-xs text-on-surface-variant opacity-60 mt-4">
              © {new Date().getFullYear()} SNITCH CLOTHING. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>

        {/* ── Quick View Modal ── */}
        {quickViewProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <div
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            />

            {/* Modal panel */}
            <div className="relative bg-white max-w-4xl w-full flex flex-col md:flex-row shadow-2xl rounded-none overflow-hidden z-10 border border-outline/10 animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 material-symbols-outlined text-primary font-bold hover:opacity-75 z-20 cursor-pointer p-1 bg-white/80 rounded-full"
              >
                close
              </button>

              {/* Product gallery */}
              <div className="w-full md:w-1/2 aspect-[4/5] bg-surface-container">
                <img
                  src={
                    quickViewProduct.images && quickViewProduct.images.length > 0
                      ? quickViewProduct.images[0].url
                      : "/snitch_editorial_warm.png"
                  }
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                <span className="font-label text-[10px] tracking-widest text-secondary font-bold uppercase mb-2">
                  CURATED DROP
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                  {quickViewProduct.title}
                </h2>
                <p className="font-label text-base font-bold text-primary tracking-widest mb-6">
                  {quickViewProduct.price?.currency || "$"}{" "}
                  {quickViewProduct.price?.amount?.toLocaleString()}
                </p>

                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                  {quickViewProduct.description}
                </p>

                {/* Color Selector */}
                <div className="mb-6">
                  <span className="font-label text-[10px] tracking-widest font-bold mb-3 block">
                    SELECT SHADE
                  </span>
                  <div className="flex gap-3">
                    {["SAGE", "CHARCOAL", "CREAM"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`w-8 h-8 rounded-full border border-black/10 transition-all ${
                          col === "SAGE"
                            ? "bg-[#536255]"
                            : col === "CHARCOAL"
                            ? "bg-[#2c2c2c]"
                            : "bg-[#f5f3f0]"
                        } ${
                          selectedColor === col ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
                        }`}
                        title={col}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                  <span className="font-label text-[10px] tracking-widest font-bold mb-3 block">
                    SELECT SIZE
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {["XS", "S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? "border-primary bg-primary text-white"
                            : "border-outline/20 hover:border-primary"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct, selectedSize, selectedColor);
                    setQuickViewProduct(null);
                  }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="btn-lift w-full bg-primary text-white py-4.5 font-label text-xs uppercase tracking-widest font-bold cursor-pointer rounded-none"
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Cart Drawer (Side Bag) ── */}
        <div
          className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
            isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />

          {/* Cart Panel */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out z-10 ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-8 border-b border-outline/10 flex justify-between items-center">
              <h2 className="font-display text-xl font-bold tracking-tight">Your Bag ({cart.length})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="material-symbols-outlined text-primary font-bold hover:opacity-75 cursor-pointer leading-none"
              >
                close
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-4 border-b border-outline/5 pb-6 last:border-none"
                  >
                    <div className="w-20 h-24 bg-surface-container overflow-hidden flex-shrink-0">
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0].url : "/snitch_editorial_warm.png"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-display text-sm font-semibold">{item.title}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                          Size: {item.selectedSize} | Shade: {item.selectedColor}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-label text-xs font-bold text-primary">
                          {item.price?.currency || "$"}{" "}
                          {item.price?.amount?.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.cartId)}
                          className="text-[10px] font-bold text-error tracking-wider uppercase hover:opacity-75"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-5xl mb-4">shopping_bag</span>
                  <p className="font-body text-sm font-semibold">Your bag is currently empty.</p>
                </div>
              )}
            </div>

            {/* Subtotal & Slide to Checkout */}
            <div className="p-8 bg-surface-container-low border-t border-outline/10">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-label text-xs font-bold text-on-surface-variant tracking-wider">
                  SUBTOTAL
                </span>
                <span className="font-display text-lg font-extrabold">
                  USD ${" "}
                  {cart
                    .reduce((acc, item) => acc + (item.price?.amount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>

              {cart.length > 0 ? (
                <SliderCheckout
                  onComplete={handleCheckoutComplete}
                  setCursorHovered={setCursorHovered}
                />
              ) : (
                <button
                  disabled
                  className="w-full h-14 bg-surface-container text-on-surface-variant/40 rounded-full font-label text-xs font-bold tracking-widest uppercase cursor-not-allowed flex items-center justify-center border border-outline/5"
                >
                  BAG IS EMPTY
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Toast Notifications ── */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-primary text-white px-6 py-4 rounded-full font-label text-[10px] tracking-widest font-bold shadow-xl flex items-center justify-center gap-3 animate-in slide-in-from-bottom-6 fade-in duration-300"
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              {toast.message.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

