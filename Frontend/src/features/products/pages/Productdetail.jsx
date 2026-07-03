import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

const FALLBACK_PRODUCTS = [
  {
    _id: "curated_1",
    title: "Sage Heavyweight Hoodie",
    description: "An oversized, ultra-premium hoodie. Features double-lined hood, heavy cotton drape, and tonal clean stitching.",
    price: { currency: "USD", amount: 110 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADaKw0h5hvsCnFa5GVAWqv0OWJiDeEER5Q9nS031XXLotgmd8qF__Lp8tFvPt2SOTT6tWzPCD7pY0uzsGE47k3hAc7dunoPvnu64jqWqJ972LJmeNlOVmnXnKzAdsXHo2z0jjpaKOxPuhMCTFJNanJjckcCp0Yau8NNc-0H3cLtTTbGtliA-dr4xlQZR-lNe-ywPdCy73bWtp4ELFVXvpdmeOOo7Ilf8BX6Bm0RHJQWENBFgg8xzpiLg" }],
    category: "Streetwear"
  },
  {
    _id: "curated_2",
    title: "Stealth Cargo Trousers",
    description: "Tapered black cargos engineered with architectural silhouettes and premium technical water-repellent fabric.",
    price: { currency: "USD", amount: 145 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnymvr3rN-A2Ijz0WqNqpOMXBWDNeLupsLBHplp62pbEQX1LpKtSmvPYbxTHMOgsVUyI_NKwkKsMnP7GHvTNdDLYGBJZA93gpatGMcnEG9yW_TrWyYjqsYnm4ayKn0QeGhcKjX56sQMqf8iDXK-UKC8FshrqqEzlq23vzcSWMRfMwqrswIZkn3l88b2tKI0Tw81_LL2lnyCoZY0Swhpm2U0M9qW3vbNUzjUMWJzdzDC9hSibi4e98h9w" }],
    category: "Streetwear"
  },
  {
    _id: "curated_3",
    title: "Architect Linen Shirt",
    description: "Breathable textured white linen shirt. Perfectly structured for transition between professional and casual environments.",
    price: { currency: "USD", amount: 85 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbExq1b52hQoP3wOu9A5KzOphj3eC26qafdInmWf79_w7veWmuzhjcMpQPnm79eYclNjKJazZ9Cqj1KIc_kH1XYJ78yKkPksmBOutyuQNj51sJmpiuFs_3i9M1b2DSFlVCg1sDYkeX1pBkzsItOKCr_4IuX2Xq29ecqE5f-WMjYtkM_fPNB_sv3G7Fim3uPyXRzQTYrGhZB1Gk7F_F9PzU4_gxRMhrxqMZQO8XOTnOIOwUBBNGunOwQg" }],
    category: "Essentials"
  },
  {
    _id: "curated_4",
    title: "Essential Boxy Tee",
    description: "Classic loose fitting essential tee. Heavyweight organic cotton with sharp crew neck and a clean lookbook line.",
    price: { currency: "USD", amount: 55 },
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvnR3oHBpiZz1RNzq6Q3aFVrvpJ4gSLpHn0EgkZ421z6y-nTqt6FD88pINk51kICVBGuLZ-LTUCROrRSUXMwJjbJtraFeSdkT-M3EJBBT-2qBpoxcwvHQMujWrkrP3ZvYT39iJRhK5FajJlZDeV5BEvbh-giu2_Nc7KeZhvUpEQsMCFrYqEmpOrWb2IOf-Mp_8LDSim4BNUzcgEYkEqkJV3lYpkdGjRGqpYHWT2OLohcFyuQ1kFMeUlA" }],
    category: "Essentials"
  }
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const navigate = useNavigate();
  const { handleGetProductById, handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);

  // Custom visual state moments
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [toasts, setToasts] = useState([]);

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      const foundProduct = data?.product || data;
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        const fallback = FALLBACK_PRODUCTS.find((p) => p._id === productId);
        setProduct(fallback || null);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
      const fallback = FALLBACK_PRODUCTS.find((p) => p._id === productId);
      setProduct(fallback || null);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);



  console.log(product);
  

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const displayRelated = useMemo(() => {
    const realRelated = products?.filter((p) => p._id !== productId) || [];
    const combined = [...realRelated];
    FALLBACK_PRODUCTS.forEach((fb) => {
      if (fb._id !== productId && !combined.some((item) => item._id === fb._id)) {
        combined.push(fb);
      }
    });
    return combined.slice(0, 4);
  }, [products, productId]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => {
      if (!v.attributes) return false;
      const vKeys = Object.keys(v.attributes);
      const sKeys = Object.keys(selectedAttributes);
      const isMatch = vKeys.every(
        (k) => v.attributes[k] === selectedAttributes[k],
      );
      return vKeys.length === sKeys.length && isMatch;
    });
  }, [product, selectedAttributes]);

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const attrs = {};
    product.variants.forEach((variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    Object.keys(attrs).forEach((key) => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };

    // Find if an exact match exists for this combination
    const exactMatch = product.variants.find((v) => {
      const vAttrs = v.attributes || {};
      return (
        Object.keys(newAttrs).every((k) => newAttrs[k] === vAttrs[k]) &&
        Object.keys(vAttrs).every((k) => newAttrs[k] === vAttrs[k])
      );
    });

    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      // Find any variant that has this newly selected attribute to fallback nicely
      const fallbackVariant = product.variants.find(
        (v) => v.attributes && v.attributes[attrName] === value,
      );
      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      } else {
        setSelectedAttributes(newAttrs);
      }
    }
  };

  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center selection:bg-secondary-container/30"
        style={{ backgroundColor: "#f9f9f7" }}
      >
        <p
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#7e7576" }}
          className="text-xs uppercase tracking-[0.2em] font-bold animate-pulse"
        >
          Retrieving piece...
        </p>
      </div>
    );
  }

  // Fallbacks
  const displayImages =
    activeVariant?.images && activeVariant.images.length > 0
      ? activeVariant.images
      : product.images && product.images.length > 0
        ? product.images
        : [{ url: "/snitch_editorial_warm.png" }];

  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

  const displayTitle = activeVariant?.title || product.title;

  const displayDescription = activeVariant?.description || product.description;

  const displayStock = (activeVariant && activeVariant.stock !== undefined)
    ? activeVariant.stock
    : product.stock;

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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .active-swatch {
          outline: 1.5px solid #000;
          outline-offset: 3px;
        }
        .btn-lift {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-lift:hover {
          transform: translateY(-2px);
        }
        .btn-lift:active {
          transform: translateY(0) scale(0.98);
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

      {/* ── Toast Notifications ── */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-primary text-on-primary px-6 py-4 rounded-none shadow-xl border border-outline/20 font-body text-xs tracking-wider uppercase animate-in slide-in-from-top-4 duration-300 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[16px] text-accent-sage">check_circle</span>
            {toast.message}
          </div>
        ))}
      </div>

      <div
        className="min-h-screen selection:bg-secondary-container selection:text-on-secondary-container"
        style={{
          backgroundColor: "#f9f9f7",
          fontFamily: "'Hanken Grotesk', sans-serif",
        }}
      >
        {/* ── Top Navigation Bar ── */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 h-20 bg-surface/85 backdrop-blur-md border-b border-outline-variant/30">
          <div className="flex items-center gap-8">
            <span
              onClick={() => navigate("/")}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="text-2xl font-extrabold tracking-tighter text-primary cursor-pointer select-none"
            >
              SNITCH
            </span>
            <nav className="hidden md:flex gap-6 items-center">
              <span
                onClick={() => navigate("/")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="text-[12px] font-bold tracking-widest text-primary uppercase cursor-pointer hover:opacity-70 transition-opacity"
              >
                Shop All
              </span>
              <span
                onClick={() => navigate("/")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase cursor-pointer hover:text-primary transition-colors"
              >
                New Arrivals
              </span>
              <span
                onClick={() => navigate("/")}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase cursor-pointer hover:text-primary transition-colors"
              >
                Collections
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity"
            >
              search
            </span>
            <span
              onClick={() => navigate("/seller/dashboard")}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity"
            >
              person
            </span>
            <span
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity"
            >
              shopping_bag
            </span>
          </div>
        </header>

        {/* ── Main Layout ── */}
        <main className="pt-20">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-0">
            {/* Left Column: Image Gallery with Sidebar Thumbnails */}
            <div className="w-full md:w-3/5 flex flex-col-reverse md:flex-row gap-6 py-8 pr-0 md:pr-10 items-start">
              {/* Thumbnails Sidebar */}
              {displayImages.length > 1 && (
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto w-full md:w-24 flex-shrink-0 no-scrollbar max-h-[600px] pb-2 md:pb-0">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden bg-surface-container-low border transition-all duration-300 ${
                        selectedImage === idx
                          ? "border-primary ring-1 ring-primary ring-offset-2 opacity-100"
                          : "border-outline-variant/40 opacity-50 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                      style={{ "--tw-ring-offset-color": "#f9f9f7" }}
                    >
                      <img
                        src={img.url}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative flex-grow aspect-[4/5] bg-surface-container-low border border-outline-variant/15 overflow-hidden group">
                <img
                  src={displayImages[selectedImage]?.url || displayImages[0].url}
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.02]"
                />
                
                {displayImages.length > 1 && (
                  <>
                    {/* Left Navigation Arrow */}
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1
                        )
                      }
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-outline-variant/40 bg-surface/85 text-primary hover:bg-surface cursor-pointer rounded-none"
                      aria-label="Previous image"
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>

                    {/* Right Navigation Arrow */}
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-outline-variant/40 bg-surface/85 text-primary hover:bg-surface cursor-pointer rounded-none"
                      aria-label="Next image"
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Product Info */}
            <div className="w-full md:w-2/5 md:pl-16 relative">
              <div className="md:sticky md:top-28 py-8 md:py-16">
                <div className="mb-2">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                    {product.category || "CURATED DROP"}
                  </span>
                </div>
                <h1 className="font-headline text-[32px] md:text-[40px] font-extrabold leading-tight tracking-tight mb-4 text-primary">
                  {displayTitle}
                </h1>

                <p className="text-xl font-bold mb-8 text-primary tracking-widest">
                  {displayPrice?.currency || "$"}{" "}
                  {displayPrice?.amount?.toLocaleString()}
                </p>

                <div className="space-y-8">
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {displayDescription || "A meticulously tailored essential crafted for modern lookbooks, showcasing fine textile patterns and high-performance design definitions."}
                  </p>

                  {/* Select Variant Card/Chip Grid */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">
                      <span className="text-[12px] font-bold uppercase tracking-widest block mb-4">
                        Select Variant Style
                      </span>
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {product.variants.map((v) => {
                          const isSelected = activeVariant?._id === v._id;
                          const varImages = v.images && v.images.length > 0 ? v.images : product.images;
                          const varPrice = v.price?.amount ? v.price : product.price;
                          const varStock = v.stock !== undefined ? v.stock : product.stock;

                          return (
                            <button
                              key={v._id}
                              onClick={() => setSelectedAttributes(isSelected ? {} : (v.attributes || {}))}
                              onMouseEnter={() => setCursorHovered(true)}
                              onMouseLeave={() => setCursorHovered(false)}
                              className={`flex-shrink-0 flex items-center gap-4 p-3 border text-left cursor-pointer transition-all duration-300 ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-md scale-[1.02] active-swatch"
                                  : "border-outline-variant/60 bg-surface/50 hover:border-primary hover:bg-surface hover:scale-[1.01]"
                              }`}
                              style={{ width: "210px" }}
                            >
                              {/* Variant Image Preview */}
                              <div className="w-12 h-16 bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/20">
                                <img
                                  src={varImages && varImages[0]?.url || "/snitch_editorial_warm.png"}
                                  alt="Variant Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Variant Metadata */}
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary truncate font-label">
                                  {Object.entries(v.attributes || {})
                                    .map(([key, val]) => val)
                                    .join(" / ")}
                                </div>
                                <div className="text-xs text-on-surface-variant mt-1 font-bold">
                                  {varPrice?.currency || "$"}{" "}
                                  {varPrice?.amount?.toLocaleString()}
                                </div>
                                <div className="text-[9px] uppercase tracking-widest mt-1 font-bold flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${varStock > 0 ? "bg-secondary" : "bg-error"}`} />
                                  <span className="text-on-surface-variant/70 font-label">
                                    {varStock > 0 ? `${varStock} units` : "Sold Out"}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Attributes / Variants Options */}
                  {Object.entries(availableAttributes).map(([attrName, values]) => {
                    const isColorAttr = attrName.toLowerCase() === "color" || attrName.toLowerCase() === "shade";
                    
                    return (
                      <div key={attrName} className="mb-6">
                        <span className="text-[12px] font-bold uppercase tracking-widest block mb-4">
                          {attrName}: <span className="text-primary font-extrabold">{selectedAttributes[attrName] || ""}</span>
                        </span>

                        <div className="flex flex-wrap gap-3">
                          {values.map((val) => {
                            const isSelected = selectedAttributes[attrName] === val;
                            
                            // Render colors as circular swatches, others as text chips
                            if (isColorAttr) {
                              // Map common colors to CSS hex values
                              let colorBg = "#dadad8";
                              const colorLower = val.toLowerCase();
                              if (colorLower === "ecru" || colorLower === "cream" || colorLower === "white") {
                                colorBg = "#f5f3f0";
                              } else if (colorLower === "sage" || colorLower === "green") {
                                colorBg = "#536255";
                              } else if (colorLower === "midnight" || colorLower === "black" || colorLower === "charcoal") {
                                colorBg = "#1A1C1B";
                              } else if (colorLower === "navy" || colorLower === "blue") {
                                colorBg = "#1e3a8a";
                              } else if (colorLower === "khaki" || colorLower === "tan") {
                                colorBg = "#d7c49e";
                              }

                              return (
                                <button
                                  key={val}
                                  onClick={() => handleAttributeChange(attrName, val)}
                                  onMouseEnter={() => setCursorHovered(true)}
                                  onMouseLeave={() => setCursorHovered(false)}
                                  className={`w-8 h-8 rounded-full border border-outline-variant/60 cursor-pointer transition-all duration-300 ${isSelected ? "active-swatch" : "hover:scale-110"}`}
                                  style={{ backgroundColor: colorBg }}
                                  title={val}
                                />
                              );
                            }

                            // Standard Text swatches for Sizes or other options
                            return (
                              <button
                                key={val}
                                onClick={() => handleAttributeChange(attrName, val)}
                                onMouseEnter={() => setCursorHovered(true)}
                                onMouseLeave={() => setCursorHovered(false)}
                                className={`h-12 px-6 border text-[12px] font-bold uppercase tracking-widest flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? "border-primary bg-primary text-on-primary"
                                    : "border-outline-variant text-on-surface hover:border-primary"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Stock State */}
                  {displayStock !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${displayStock > 0 ? "bg-secondary" : "bg-error"}`} />
                      <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                        {displayStock > 0 ? `${displayStock} units available` : "Sold Out"}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 pt-4">
                    <button
                      onClick={() => triggerToast(`Added ${displayTitle} to Bag`)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="btn-lift w-full bg-primary text-on-primary py-5 text-[12px] font-bold tracking-widest uppercase hover:translate-y-[-2px] active:scale-[0.99] transition-all duration-300 cursor-pointer"
                    >
                      Add to Bag
                    </button>
                    
                    <button
                      onClick={() => triggerToast("Initializing secure checkout...")}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="btn-lift w-full border border-primary text-primary py-5 text-[12px] font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary hover:translate-y-[-2px] active:scale-[0.99] transition-all duration-300 cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Accordion Tabs */}
                  <div className="pt-8 border-t border-outline-variant/30 space-y-6">
                    <details className="group cursor-pointer">
                      <summary
                        onMouseEnter={() => setCursorHovered(true)}
                        onMouseLeave={() => setCursorHovered(false)}
                        className="flex justify-between items-center list-none text-[12px] font-bold tracking-widest uppercase text-primary font-label"
                      >
                        Details & Care
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      <div className="pt-4 text-xs text-on-surface-variant leading-relaxed font-body">
                        <ul className="space-y-2 list-disc list-inside">
                          <li>100% Certified Premium Flax Linen</li>
                          <li>Relaxed lookbook silhouette with drop shoulders</li>
                          <li>Aesthetic raw-hem detailing and minimal stitches</li>
                          <li>Cold machine wash separately; air dry recommended</li>
                        </ul>
                      </div>
                    </details>

                    <details className="group cursor-pointer">
                      <summary
                        onMouseEnter={() => setCursorHovered(true)}
                        onMouseLeave={() => setCursorHovered(false)}
                        className="flex justify-between items-center list-none text-[12px] font-bold tracking-widest uppercase text-primary font-label"
                      >
                        Shipping & Returns
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      <div className="pt-4 text-xs text-on-surface-variant leading-relaxed font-body">
                        Complimentary premium shipping on all orders over $150. Returns accepted within 14 days of delivery in pristine, original packaging.
                      </div>
                    </details>
                  </div>

                  {/* Sustainability Badges */}
                  <div className="flex gap-8 pt-8 border-t border-outline-variant/30">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">eco</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest font-label text-on-surface-variant">Organic</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest font-label text-on-surface-variant">Ethical</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">cyclone</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest font-label text-on-surface-variant">Circular</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ── Complete the Look Section ── */}
          <section className="mt-32 px-6 md:px-16 py-24 bg-surface-container-low border-t border-outline-variant/30">
            <div className="max-w-[1440px] mx-auto">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-12 uppercase font-headline">
                Complete the Look
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {displayRelated.map((item) => {
                  const hasImages = item.images && item.images.length > 0;
                  const primaryImageUrl = hasImages
                    ? item.images[0].url
                    : "/snitch_editorial_warm.png";

                  return (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/product/${item._id}`)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="group flex flex-col cursor-pointer"
                    >
                      <div className="aspect-[3/4] overflow-hidden mb-4 bg-surface-container border border-outline-variant/10">
                        <img
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                          src={primaryImageUrl}
                          alt={item.title}
                        />
                      </div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-primary mb-1 font-label">
                        {item.title}
                      </span>
                      <span className="text-xs text-on-surface-variant font-bold">
                        {item.price?.currency || "$"}{" "}
                        {item.price?.amount?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="w-full py-20 px-8 md:px-32 flex flex-col md:flex-row justify-between gap-12 bg-surface-container-low border-t border-outline-variant">
          <div className="space-y-6">
            <span className="text-2xl font-extrabold tracking-tighter text-primary">SNITCH</span>
            <p className="text-xs font-body text-on-surface-variant max-w-xs leading-relaxed">
              Curated essentials for the modern architect of self. Quality, sustainability, and effortless cool.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Shop</span>
              <span onClick={() => navigate("/")} className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Shop All</span>
              <span onClick={() => navigate("/")} className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">New Arrivals</span>
              <span onClick={() => navigate("/")} className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Collections</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Care</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Returns</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Shipping</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Care Guide</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Brand</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">About Us</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Sustainability</span>
              <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">Journal</span>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">© 2026 SNITCH. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ProductDetail;
