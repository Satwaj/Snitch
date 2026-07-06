import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../../products/hooks/useProduct";

const Nav = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleGetAllProducts } = useProduct();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items);
  const products = useSelector((state) => state.product.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

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
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: "#e4e2df",
        background:
          "linear-gradient(180deg, rgba(251,249,246,0.96) 0%, rgba(251,249,246,0.88) 100%)",
      }}
      ref={dropdownRef}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center justify-between gap-4 lg:shrink-0">
            <Link
              to="/"
              className="logo-hover text-sm font-medium uppercase tracking-[0.35em] transition-opacity hover:opacity-80"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
              }}
            >
              Snitch.
            </Link>

            <div className="flex items-center gap-3 lg:hidden">
              <Link
                to="/cart"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
                aria-label="Shopping cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartItems?.length > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
                    style={{ backgroundColor: "#C9A96E" }}
                  >
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <form className="relative flex-1" onSubmit={handleSearchSubmit}>
            <div
              className="flex items-center gap-3 rounded-full border px-4 py-3 transition-shadow focus-within:shadow-[0_0_0_4px_rgba(201,169,110,0.12)]"
              style={{ backgroundColor: "#fff", borderColor: "#e4e2df" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#7A6E63" }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for jackets, sneakers, accessories..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#9c9187]"
                style={{ color: "#1b1c1a" }}
              />
              <button
                type="submit"
                className="hidden rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors sm:inline-flex"
                style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
              >
                Search
              </button>
            </div>

            {isSearchFocused && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(27,28,26,0.12)]"
                style={{ borderColor: "#e4e2df", backgroundColor: "#fbf9f6" }}
              >
                <div
                  className="border-b px-5 py-3"
                  style={{ borderColor: "#e4e2df" }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "#7A6E63" }}
                  >
                    Related products
                  </p>
                </div>

                <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                  {suggestions.map((product) => {
                    const imageUrl =
                      product.images && product.images.length > 0
                        ? product.images[0].url
                        : "/snitch_editorial_warm.png";

                    return (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[#f4efe7]"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <div
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl"
                          style={{ backgroundColor: "#f5f3f0" }}
                        >
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-medium"
                            style={{ color: "#1b1c1a" }}
                          >
                            {product.title}
                          </p>
                          <p
                            className="truncate text-[12px]"
                            style={{ color: "#7A6E63" }}
                          >
                            {product.description}
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: "#C9A96E" }}
                        >
                          {product.price?.currency}{" "}
                          {product.price?.amount?.toLocaleString()}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </form>

          <div className="flex items-center justify-between gap-3 lg:shrink-0">
            <div
              className="hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] md:flex"
              style={{ color: "#7A6E63" }}
            >
              <Link
                to="/"
                className="nav-link-effect transition-colors hover:text-[#C9A96E]"
              >
                New In
              </Link>
              <Link
                to="/menu"
                className="nav-link-effect transition-colors hover:text-[#C9A96E]"
              >
                Shop All
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="relative hidden h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E] lg:inline-flex"
                    style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
                    aria-label="Shopping cart"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {cartItems?.length > 0 && (
                      <span
                        className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
                        style={{ backgroundColor: "#C9A96E" }}
                      >
                        {cartItems.length > 9 ? "9+" : cartItems.length}
                      </span>
                    )}
                  </Link>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((open) => !open)}
                      className="flex items-center gap-3 rounded-full border px-2 py-1.5 text-left transition-colors hover:border-[#C9A96E]"
                      style={{
                        borderColor: "#e4e2df",
                        backgroundColor: "#fff",
                      }}
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold uppercase"
                        style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
                      >
                        {initials}
                      </span>
                      <span className="hidden pr-1 md:block">
                        <span
                          className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: "#7A6E63" }}
                        >
                          Account
                        </span>
                        <span
                          className="block text-sm font-medium"
                          style={{ color: "#1b1c1a" }}
                        >
                          {user.fullname}
                        </span>
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div
                        className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-3xl border shadow-[0_24px_60px_rgba(27,28,26,0.14)]"
                        style={{
                          borderColor: "#e4e2df",
                          backgroundColor: "#fbf9f6",
                        }}
                      >
                        <div
                          className="px-5 py-4"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(201,169,110,0.12), rgba(180,196,180,0.10))",
                          }}
                        >
                          <p
                            className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                            style={{ color: "#7A6E63" }}
                          >
                            Signed in as
                          </p>
                          <p
                            className="mt-1 text-sm font-medium"
                            style={{ color: "#1b1c1a" }}
                          >
                            {user.fullname}
                          </p>
                          <p
                            className="text-[12px]"
                            style={{ color: "#7A6E63" }}
                          >
                            {user.email}
                          </p>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-[#f4efe7]"
                            style={{ color: "#1b1c1a" }}
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span
                              className="flex h-9 w-9 items-center justify-center rounded-full"
                              style={{ backgroundColor: "#f4efe7" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21a8 8 0 1 0-16 0" />
                                <circle cx="12" cy="8" r="4" />
                              </svg>
                            </span>
                            <span>
                              <span className="block font-medium">
                                Manage account
                              </span>
                              <span
                                className="block text-[12px]"
                                style={{ color: "#7A6E63" }}
                              >
                                Profile, details and preferences
                              </span>
                            </span>
                          </Link>

                          {user.role === "seller" && (
                            <Link
                              to="/seller/dashboard"
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-[#f4efe7]"
                              style={{ color: "#1b1c1a" }}
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <span
                                className="flex h-9 w-9 items-center justify-center rounded-full"
                                style={{ backgroundColor: "#f4efe7" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M4 6h16v12H4z" />
                                  <path d="M4 10h16" />
                                  <path d="M8 6v12" />
                                </svg>
                              </span>
                              <span>
                                <span className="block font-medium">
                                  Seller dashboard
                                </span>
                                <span
                                  className="block text-[12px]"
                                  style={{ color: "#7A6E63" }}
                                >
                                  Products, sales and orders
                                </span>
                              </span>
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={handleLogoutClick}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-[#f9ece8]"
                            style={{ color: "#a12a2a" }}
                          >
                            <span
                              className="flex h-9 w-9 items-center justify-center rounded-full"
                              style={{ backgroundColor: "#f9ece8" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M21 3v18" />
                              </svg>
                            </span>
                            <span>
                              <span className="block font-medium">Log out</span>
                              <span
                                className="block text-[12px]"
                                style={{ color: "#7A6E63" }}
                              >
                                End your session on this device
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                    style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors"
                    style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
