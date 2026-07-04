import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "../../shared/components/Navbar";
import { useCart } from "../hook/useCart";
import {} from "../services/cart.api";

// ── Ultra-Premium Stitch Checkout Slider ──
const StitchSliderCheckout = ({ onComplete }) => {
  const [position, setPosition] = useState(0);
  const trackRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);

  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const handleWidth = 56;
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

  React.useEffect(() => {
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
      className="relative h-16 bg-[#111111] border border-black/10 flex items-center justify-center select-none cursor-pointer rounded-none"
    >
      <span className="text-[10px] font-bold tracking-[0.3em] text-white/70 uppercase">
        {position > 180 ? "Release to confirm order" : "Slide to place order"}
      </span>
      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        style={{ transform: `translateX(${position}px)` }}
        className="absolute left-1 top-1 bottom-1 w-14 bg-white text-black rounded-none flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 shadow-xl border border-black/5"
      >
        <span className="material-symbols-outlined text-[18px] font-bold">arrow_right_alt</span>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();

  // Hook/Selectors
  const { handleGetCart } = useCart();
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.items || [];
  const user = useSelector((state) => state.auth.user);

  // Local UI states
  const [toasts, setToasts] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);

  // Toast helper
  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Fetch cart
  useEffect(() => {
    if (user) {
      handleGetCart();
    }
  }, [user]);

  // Normalize cart items
  const normalizedItems = useMemo(() => {
    return cartItems.map((item) => {
      const isPopulated = item.product && typeof item.product === "object";
      return {
        cartId: item._id,
        productId: isPopulated ? item.product._id : item.product,
        title: isPopulated ? item.product.title : "Product Item",
        description: isPopulated ? item.product.description : "",
        priceAmount: isPopulated ? (item.product.price?.amount || 0) : 0,
        currency: isPopulated ? (item.product.price?.currency || "INR") : "INR",
        quantity: item.quantity || 1,
        variantId: item.variant,
        imageUrl: isPopulated ? (item.product.images?.[0]?.url) : "",
        selectedSize: item.selectedSize || "M",
        selectedColor: item.selectedColor || "OATMEAL",
      };
    });
  }, [cartItems]);

  // Total
  const { subtotal, currencySymbol } = useMemo(() => {
    let sub = 0;
    let symbol = "₹";
    if (normalizedItems.length > 0) {
      sub = normalizedItems.reduce((acc, item) => acc + (item.priceAmount * item.quantity), 0);
      symbol = normalizedItems[0].currency === "INR" ? "₹" : "$";
    }
    return { subtotal: sub, currencySymbol: symbol };
  }, [normalizedItems]);

  // Actions
  const handleRemove = async (item) => {
    try {
      await removeItemFromCart({ productId: item.productId, variantId: item.variantId });
      await handleGetCart();
      triggerToast(`Removed item from bag`);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleQuantityChange = async (item, newQty) => {
    if (newQty <= 0) {
      await handleRemove(item);
      return;
    }

    try {
      await updateItemQuantity({
        productId: item.productId,
        variantId: item.variantId,
        quantity: newQty,
      });
      await handleGetCart();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  // Checkout complete
  const handleCheckoutComplete = () => {
    triggerToast("Placing order through secure routing...");
    setTimeout(() => {
      setOrderComplete(true);
      triggerToast("Order placed successfully!");
    }, 1500);
  };

  return (
    <>
      {/* Head Links Injection */}
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-primary text-on-primary px-6 py-4 rounded-none shadow-xl border border-outline/20 font-body text-xs tracking-wider uppercase animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 justify-center pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[16px] text-accent-sage">check_circle</span>
            {toast.message}
          </div>
        ))}
      </div>

      <div
        className="min-h-screen pt-28 pb-20 selection:bg-secondary-container/30 selection:text-on-secondary-container"
        style={{
          backgroundColor: "#f9f9f7",
          fontFamily: "'Hanken Grotesk', sans-serif",
        }}
      >
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-primary mb-12 uppercase">
            Capsule Bag
          </h1>

          {orderComplete ? (
            <div className="py-24 text-center border border-outline-variant/30 bg-surface-container-low p-8">
              <span className="material-symbols-outlined text-5xl text-secondary mb-4">check_circle</span>
              <h2 className="text-xl font-bold mb-2">Order Confirmed</h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8">
                Thank you for your order. We have received it and are preparing your aesthetic delivery drop.
              </p>
              <button
                onClick={() => {
                  setOrderComplete(false);
                  navigate("/");
                }}
                className="bg-primary text-on-primary px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:translate-y-[-2px] transition-transform rounded-none"
              >
                Continue Shopping
              </button>
            </div>
          ) : normalizedItems.length > 0 ? (
            <div className="space-y-8">
              {/* Items List */}
              <div className="border border-outline-variant/30 bg-surface-container-lowest divide-y divide-outline-variant/30">
                {normalizedItems.map((item) => {
                  const imgUrl = item.imageUrl || "/snitch_editorial_warm.png";
                  return (
                    <div key={item.cartId} className="p-6 flex gap-6 items-center">
                      {/* Image */}
                      <div
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="w-24 aspect-[3/4] bg-surface-container overflow-hidden flex-shrink-0 cursor-pointer border border-outline-variant/10 hover:scale-[1.02] transition-transform duration-300"
                      >
                        <img src={imgUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-grow flex flex-col justify-between py-1 min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3
                              onClick={() => navigate(`/product/${item.productId}`)}
                              className="font-display text-base font-bold cursor-pointer hover:underline text-primary truncate"
                            >
                              {item.title}
                            </h3>
                            <button
                              onClick={() => handleRemove(item)}
                              className="material-symbols-outlined text-on-surface-variant hover:text-error text-lg cursor-pointer"
                            >
                              delete
                            </button>
                          </div>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex items-center border border-outline-variant">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-4 text-xs font-bold font-body text-primary">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-label text-sm font-bold text-primary tracking-wider">
                            {currencySymbol} {(item.priceAmount * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary & Slider Checkout */}
              <div className="border border-outline-variant/30 bg-surface-container-lowest p-8 space-y-6">
                <div className="flex justify-between items-baseline border-b border-outline-variant/30 pb-4">
                  <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-label text-lg font-bold text-primary tracking-wider">
                    {currencySymbol} {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest leading-relaxed">
                  Shipping, duty, and secure packaging validation are finalized at the slider checkout routing below.
                </p>

                <div className="pt-4">
                  <StitchSliderCheckout onComplete={handleCheckoutComplete} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center border border-outline-variant/30 bg-surface-container-lowest p-8">
              <span className="material-symbols-outlined text-5xl opacity-35 mb-4">shopping_bag</span>
              <h2 className="text-lg font-bold mb-2">Your Capsule Bag is Empty</h2>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-8">
                Your archive collection currently contains no drops. Explore our pieces to customize your aesthetics.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-on-primary px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:translate-y-[-2px] transition-transform rounded-none"
              >
                Go Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
