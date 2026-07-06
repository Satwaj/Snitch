import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Package, Truck, MapPin, Calendar, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector((state) => state.product.products) || [];
  const queryOrderId = searchParams.get("orderId") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryOrderId);
  const [emailInput, setEmailInput] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  const progressLineRef = useRef(null);
  const nodeRefs = useRef([]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }

    setSearching(true);
    setError(null);
    setTrackingData(null);

    // Simulate network delay
    setTimeout(() => {
      const id = orderIdInput.trim().toUpperCase();
      
      // Determine a stage (0 to 4) based on the order ID hashing
      const charCodeSum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const stage = charCodeSum % 5; // 0: Confirmed, 1: Processing, 2: In Transit, 3: Out for Delivery, 4: Delivered
      
      // Select 1 or 2 products from the store, or use default luxury items
      const selectedProducts = [];
      if (products.length > 0) {
        selectedProducts.push(products[charCodeSum % products.length]);
        if (products.length > 1) {
          selectedProducts.push(products[(charCodeSum + 1) % products.length]);
        }
      } else {
        selectedProducts.push({
          title: "Architectural Wool Overcoat",
          description: "Camel cashmere-wool blend tailcoat",
          price: { currency: "INR", amount: 9999 },
          images: [{ url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=300" }]
        });
      }

      const dateBase = new Date();
      dateBase.setDate(dateBase.getDate() - 3);

      const mockData = {
        orderId: id,
        email: emailInput || "guest@snitch.com",
        date: new Date(dateBase).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        estimatedDelivery: new Date(Date.now() + (stage === 4 ? -24 : 48) * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        status: ["Confirmed", "In Production", "In Transit", "Out for Delivery", "Delivered"][stage],
        stage: stage,
        carrier: "Snitch Atelier Courier",
        trackingNumber: "SN-" + Math.floor(10000000 + Math.random() * 90000000),
        address: "742 Avenue Montaigne, Paris, France 75008",
        items: selectedProducts.map(p => ({
          title: p.title,
          description: p.description,
          price: p.price,
          image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=300",
          quantity: 1
        })),
        timeline: [
          { title: "Order Confirmed", desc: "Your atelier request has been verified and logged", date: new Date(dateBase).toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: "10:30 AM", completed: true },
          { title: "Atelier Assembly", desc: "Materials curated and tailored custom cuts initiated", date: new Date(dateBase.setDate(dateBase.getDate() + 1)).toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: "02:15 PM", completed: stage >= 1 },
          { title: "Dispatched in Transit", desc: "Secured in high-fashion garment casing and shipped", date: new Date(dateBase.setDate(dateBase.getDate() + 1)).toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: "09:00 AM", completed: stage >= 2 },
          { title: "Out for Courier Delivery", desc: "Entrusted to local atelier private courier service", date: new Date(dateBase.setDate(dateBase.getDate() + 1)).toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: "08:45 AM", completed: stage >= 3 },
          { title: "Delivered", desc: "Hand-delivered and signed in pristine wrapping", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: "04:30 PM", completed: stage === 4 }
        ]
      };

      setTrackingData(mockData);
      setSearching(false);
      
      // Update search params to share/persist tracking
      setSearchParams({ orderId: id });
    }, 1200);
  };

  useEffect(() => {
    if (queryOrderId) {
      handleSearch();
    }
  }, [queryOrderId]);

  // GSAP animation for tracking details loading
  useEffect(() => {
    if (trackingData) {
      const activeStage = trackingData.stage;
      const progressPercent = activeStage / 4;

      // Animate progress line
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          { scaleY: progressPercent, duration: 1.5, ease: "power3.out" }
        );
      }

      // Animate checklist nodes
      nodeRefs.current.forEach((el, idx) => {
        if (el && idx <= activeStage) {
          gsap.fromTo(
            el,
            { scale: 0.8, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 0.8, delay: idx * 0.15, ease: "back.out(1.7)" }
          );
        }
      });
    }
  }, [trackingData]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen bg-[#fbf9f6] pt-12 pb-24 selection:bg-[#C9A96E]/30"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center py-12">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: "#C9A96E" }}
            >
              Order Management
            </span>
            <h1
              className="text-4xl md:text-5xl font-light tracking-tight mt-3 mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1b1c1a",
              }}
            >
              Track Your <i className="italic">Acquisition</i>
            </h1>
            <p className="text-xs text-[#7A6E63] max-w-md mx-auto leading-relaxed">
              Verify the transit status of your curated items. Enter your order details
              issued during checkout below.
            </p>
          </div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border p-8 md:p-10 mb-12 bg-white"
            style={{ borderColor: "#e4e2df" }}
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                    Order Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    placeholder="e.g. SN-58102A"
                    className="w-full bg-[#fbf9f6] border border-[#e4e2df] rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="guest@snitch.com"
                    className="w-full bg-[#fbf9f6] border border-[#e4e2df] rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 pl-2">{error}</p>}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#1b1c1a] text-[#fbf9f6] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-opacity-95 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  {searching ? (
                    <>Locating Order...</>
                  ) : (
                    <>
                      Track Acquisition <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {searching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-4"
              >
                <div className="w-10 h-10 border-2 border-t-transparent border-[#C9A96E] rounded-full animate-spin" />
                <p className="text-xs text-[#7A6E63] uppercase tracking-widest animate-pulse">
                  Querying Atelier Archives...
                </p>
              </motion.div>
            )}

            {trackingData && !searching && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-10"
              >
                {/* Meta details cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-[1.5rem] border p-6 bg-white" style={{ borderColor: "#e4e2df" }}>
                    <div className="flex items-center gap-3 text-[#C9A96E] mb-3">
                      <Calendar size={18} />
                      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                        Estimated Delivery
                      </span>
                    </div>
                    <p className="text-lg font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {trackingData.estimatedDelivery}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border p-6 bg-white" style={{ borderColor: "#e4e2df" }}>
                    <div className="flex items-center gap-3 text-[#C9A96E] mb-3">
                      <Truck size={18} />
                      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                        Carrier / Route
                      </span>
                    </div>
                    <p className="text-lg font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {trackingData.carrier}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border p-6 bg-white" style={{ borderColor: "#e4e2df" }}>
                    <div className="flex items-center gap-3 text-[#C9A96E] mb-3">
                      <Package size={18} />
                      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                        Status reference
                      </span>
                    </div>
                    <p className="text-lg font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {trackingData.status}
                    </p>
                  </div>
                </div>

                {/* Progress Visual Tracker */}
                <div className="rounded-[2rem] border p-8 md:p-12 bg-white" style={{ borderColor: "#e4e2df" }}>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
                    {/* Left: Quick overview */}
                    <div className="space-y-4 md:border-r border-[#e4e2df] md:pr-8">
                      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#7A6E63]">
                        Transit Reference
                      </span>
                      <h3 className="text-3xl font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        #{trackingData.orderId}
                      </h3>
                      <div className="space-y-1 text-xs text-[#7A6E63]">
                        <p>Placed: {trackingData.date}</p>
                        <p>Number: {trackingData.trackingNumber}</p>
                      </div>

                      <div className="pt-6">
                        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
                          <ShieldCheck size={12} /> SECURED SHIPMENT
                        </span>
                      </div>
                    </div>

                    {/* Right: Vertical Timeline */}
                    <div className="relative pl-8 md:pl-12 py-2">
                      {/* Vertical line tracks */}
                      <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-[#f5f3f0]" />
                      <div
                        ref={progressLineRef}
                        className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-[#C9A96E] origin-top scale-y-0"
                      />

                      {/* Nodes */}
                      <div className="space-y-8 relative">
                        {trackingData.timeline.map((step, idx) => {
                          const isActive = idx <= trackingData.stage;
                          return (
                            <div
                              key={idx}
                              ref={(el) => (nodeRefs.current[idx] = el)}
                              className={`flex items-start gap-4 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-35"}`}
                            >
                              {/* Indicator icon circle */}
                              <div
                                className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                                  isActive
                                    ? "bg-white border-[#C9A96E] text-[#C9A96E]"
                                    : "bg-[#fbf9f6] border-[#e4e2df] text-[#7A6E63]"
                                }`}
                              >
                                {isActive ? (
                                  <CheckCircle2 size={16} className="fill-[#C9A96E] stroke-white" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-[#7A6E63]" />
                                )}
                              </div>

                              <div className="flex-grow space-y-1">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-semibold text-[#1b1c1a]">
                                    {step.title}
                                  </h4>
                                  <span className="text-[10px] text-[#7A6E63] font-medium">
                                    {step.date} - {step.time}
                                  </span>
                                </div>
                                <p className="text-xs text-[#7A6E63] leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items in shipment */}
                <div className="rounded-[2rem] border p-8 bg-white" style={{ borderColor: "#e4e2df" }}>
                  <h4 className="text-xl font-light text-[#1b1c1a] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Pieces in transit
                  </h4>

                  <div className="divide-y divide-[#f5f3f0]">
                    {trackingData.items.map((item, index) => (
                      <div key={index} className="flex gap-6 items-center py-4 first:pt-0 last:pb-0">
                        <div className="w-20 h-24 overflow-hidden rounded-xl shrink-0" style={{ backgroundColor: "#f5f3f0" }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow space-y-1">
                          <h5 className="text-sm font-medium text-[#1b1c1a]">{item.title}</h5>
                          <p className="text-xs text-[#7A6E63] line-clamp-1">{item.description}</p>
                          <p className="text-xs text-[#7A6E63]">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-[#1b1c1a]">
                            {item.price?.currency} {item.price?.amount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#f5f3f0] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[11px] text-[#7A6E63]">
                      <MapPin size={14} className="text-[#C9A96E]" />
                      <span>Destination: <b className="text-[#1b1c1a]">{trackingData.address}</b></span>
                    </div>
                    <span className="text-sm text-[#7A6E63]">
                      Delivered via <span className="font-semibold text-[#1b1c1a]">{trackingData.carrier}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Help */}
          <div className="mt-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#7A6E63]">
              <HelpCircle size={16} className="text-[#C9A96E]" />
              <span>Questions about packaging, transit details or signature deliveries?</span>
            </div>
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest font-semibold text-[#1b1c1a] hover:text-[#C9A96E] transition-colors underline"
            >
              Contact Atelier Private Concierge
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
