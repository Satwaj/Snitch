import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../../products/hooks/useProduct";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { 
  Search, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Compass, 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  Truck, 
  ClipboardList 
} from "lucide-react";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();
  const { handleGetAllProducts } = useProduct();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items);
  const products = useSelector((state) => state.product.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

  useEffect(() => {
    if (!products || products.length === 0) {
      handleGetAllProducts().catch(() => {});
    }
  }, [handleGetAllProducts, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // GSAP animation for navbar link entrance on first load
  useEffect(() => {
    if (navLinksRef.current) {
      gsap.fromTo(
        navLinksRef.current.querySelectorAll(".nav-anim-link"),
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return (products || []).slice(0, 5);
    }

    return (products || [])
      .filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        );
      })
      .slice(0, 5);
  }, [products, searchQuery]);

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "U";

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      navigate("/");
      return;
    }

    navigate(`/menu?q=${encodeURIComponent(query)}`);
    setIsSearchFocused(false);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300"
        style={{
          borderColor: "rgba(228, 226, 223, 0.6)",
          background: "linear-gradient(180deg, rgba(251, 249, 246, 0.95) 0%, rgba(251, 249, 246, 0.85) 100%)",
        }}
        ref={dropdownRef}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-4 lg:shrink-0">
              <Link
                to="/"
                className="logo-hover text-lg font-medium uppercase tracking-[0.35em] transition-opacity hover:opacity-85 text-[#1b1c1a]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#C9A96E",
                }}
              >
                Snitch.
              </Link>
            </div>

            {/* Central Search Form */}
            <form className="relative flex-1 max-w-md hidden md:block" onSubmit={handleSearchSubmit}>
              <div
                className="flex items-center gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 focus-within:shadow-[0_0_0_4px_rgba(201,169,110,0.08)] bg-white focus-within:border-[#C9A96E]"
                style={{ borderColor: "#e4e2df" }}
              >
                <Search size={16} className="text-[#7A6E63]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for jackets, sneakers, accessories..."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-[#9c9187] text-[#1b1c1a]"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="text-[#7A6E63] hover:text-[#1b1c1a]">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Suggestions overlay */}
              <AnimatePresence>
                {isSearchFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-3xl border shadow-[0_20px_50px_rgba(27,28,26,0.08)] bg-[#fbf9f6]"
                    style={{ borderColor: "#e4e2df" }}
                  >
                    <div className="border-b px-5 py-3" style={{ borderColor: "#e4e2df" }}>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#7A6E63]">
                        Related atelier items
                      </p>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                      {suggestions.map((product) => {
                        const imageUrl =
                          product.images && product.images.length > 0
                            ? product.images[0].url
                            : "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=100";

                        return (
                          <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[#f4efe7]"
                            onClick={() => setIsSearchFocused(false)}
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f5f3f0]">
                              <img
                                src={imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-[#1b1c1a]">
                                {product.title}
                              </p>
                              <p className="truncate text-[10px] text-[#7A6E63]">
                                {product.description}
                              </p>
                            </div>
                            <span className="text-[10px] font-semibold text-[#C9A96E] shrink-0">
                              {product.price?.currency} {product.price?.amount?.toLocaleString()}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Navigation links & action icons */}
            <div className="flex items-center gap-6" ref={navLinksRef}>
              <div className="hidden lg:flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A6E63]">
                <Link to="/" className="nav-anim-link nav-link-effect transition-colors hover:text-[#C9A96E]">
                  New In
                </Link>
                <Link to="/menu" className="nav-anim-link nav-link-effect transition-colors hover:text-[#C9A96E]">
                  Shop All
                </Link>
                <Link to="/track-order" className="nav-anim-link nav-link-effect flex items-center gap-1.5 transition-colors hover:text-[#C9A96E]">
                  <Truck size={12} /> Track Order
                </Link>
              </div>

              {/* Shopping bag icon */}
              <div className="flex items-center gap-3">
                <Link
                  to="/cart"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:border-[#C9A96E] text-[#1b1c1a] border-[#e4e2df] hover:scale-105"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={15} />
                  {cartItems?.length > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white"
                      style={{ backgroundColor: "#C9A96E" }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {/* Profile menu trigger */}
                {user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((open) => !open)}
                      className="flex items-center gap-2 rounded-full border p-1 pr-3 text-left transition-all hover:border-[#C9A96E] border-[#e4e2df] bg-white cursor-pointer select-none"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold uppercase bg-[#1b1c1a] text-[#fbf9f6]">
                        {initials}
                      </span>
                      <span className="hidden md:flex items-center gap-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1b1c1a]">
                          Account
                        </span>
                        <ChevronDown size={12} className={`text-[#7A6E63] transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                      </span>
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border shadow-[0_24px_50px_rgba(27,28,26,0.1)] bg-[#fbf9f6]"
                          style={{ borderColor: "#e4e2df" }}
                        >
                          <div className="px-5 py-4 bg-gradient-to-br from-[#C9A96E]/10 to-[#b4c4b4]/5 border-b border-[#e4e2df]">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#7A6E63]">
                              Signed in as
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-[#1b1c1a] truncate">
                              {user.fullname}
                            </p>
                            <p className="text-[10px] text-[#7A6E63] truncate">
                              {user.email}
                            </p>
                          </div>

                          <div className="p-1.5 space-y-0.5">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors hover:bg-[#f4efe7] text-[#1b1c1a]"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User size={14} className="text-[#C9A96E]" />
                              <span>Manage Profile</span>
                            </Link>

                            <Link
                              to="/track-order"
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors hover:bg-[#f4efe7] text-[#1b1c1a]"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <ClipboardList size={14} className="text-[#C9A96E]" />
                              <span>Track Orders</span>
                            </Link>

                            {user.role === "seller" && (
                              <Link
                                to="/seller/dashboard"
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors hover:bg-[#f4efe7] text-[#1b1c1a]"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                <LayoutDashboard size={14} className="text-[#C9A96E]" />
                                <span>Seller Dashboard</span>
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={handleLogoutClick}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors hover:bg-red-50 text-red-700 cursor-pointer"
                            >
                              <LogOut size={14} />
                              <span>Log Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      to="/login"
                      className="rounded-full border px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] border-[#e4e2df] text-[#1b1c1a] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#1b1c1a] text-[#fbf9f6] hover:bg-opacity-90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Mobile hamburger icon */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e2df] text-[#1b1c1a] lg:hidden hover:border-[#C9A96E] transition-colors cursor-pointer"
                >
                  {isMobileMenuOpen ? <X size={16} /> : <MenuIcon size={16} />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Panel overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-x-0 top-[73px] z-30 bg-[#fbf9f6] border-b border-[#e4e2df] shadow-xl overflow-hidden lg:hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {/* Search bar on mobile */}
              <form className="relative w-full" onSubmit={handleSearchSubmit}>
                <div className="flex items-center gap-3 rounded-full border px-4 py-3 bg-white border-[#e4e2df]">
                  <Search size={16} className="text-[#7A6E63]" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search jacket, sneakers, accessories..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-[#9c9187] text-[#1b1c1a]"
                  />
                </div>
              </form>

              {/* Navigation links */}
              <div className="flex flex-col space-y-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#1b1c1a] border-t border-[#e4e2df]/50 pt-6">
                <Link to="/" className="flex items-center justify-between hover:text-[#C9A96E] transition-colors py-1">
                  <span>New In</span>
                  <Compass size={14} className="text-[#C9A96E]" />
                </Link>
                <Link to="/menu" className="flex items-center justify-between hover:text-[#C9A96E] transition-colors py-1">
                  <span>Shop All</span>
                  <ShoppingBag size={14} className="text-[#C9A96E]" />
                </Link>
                <Link to="/track-order" className="flex items-center justify-between hover:text-[#C9A96E] transition-colors py-1">
                  <span>Track Order</span>
                  <Truck size={14} className="text-[#C9A96E]" />
                </Link>
              </div>

              {/* Bottom Auth button drawer */}
              {!user && (
                <div className="flex flex-col gap-3 pt-6 border-t border-[#e4e2df]/50">
                  <Link
                    to="/login"
                    className="w-full text-center rounded-full border py-3 text-[10px] font-bold uppercase tracking-[0.2em] border-[#e4e2df] text-[#1b1c1a]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center rounded-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1b1c1a] text-[#fbf9f6]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
