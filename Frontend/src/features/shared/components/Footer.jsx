import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full py-20 px-6 md:px-12 lg:px-24 bg-white border-t border-[#e4e2df] font-body" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Brand & Intro Column */}
        <div className="md:col-span-4 space-y-6">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-[0.3em] uppercase text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A96E" }}
          >
            SNITCH.
          </Link>
          <p className="text-xs text-[#7A6E63] max-w-xs leading-relaxed">
            Curated essentials for the modern architect of self. Meticulously designed, 
            responsibly tailored, and finished with effortless refinement.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="p-2.5 rounded-full border border-[#e4e2df] text-[#7A6E63] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full border border-[#e4e2df] text-[#7A6E63] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full border border-[#e4e2df] text-[#7A6E63] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </a>
          </div>
        </div>

        {/* Link Columns Grid */}
        <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1b1c1a]">
              Shop
            </span>
            <Link to="/menu" className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors">
              Shop All
            </Link>
            <Link to="/" className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors">
              New Arrivals
            </Link>
            <Link to="/cart" className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors">
              Shopping Cart
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1b1c1a]">
              Support
            </span>
            <Link to="/track-order" className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors font-medium">
              Track Order
            </Link>
            <span className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer">
              Shipping & Returns
            </span>
            <span className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer">
              Atelier Care
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1b1c1a]">
              Atelier
            </span>
            <span className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer">
              Our Philosophy
            </span>
            <span className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer">
              Sustainability
            </span>
            <span className="text-xs text-[#7A6E63] hover:text-[#C9A96E] transition-colors cursor-pointer">
              Journal
            </span>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1b1c1a] block">
            Newsletter
          </span>
          <p className="text-[11px] text-[#7A6E63] leading-relaxed">
            Subscribe to receive private collection drops and editorial insights.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#fbf9f6] border border-[#e4e2df] rounded-full pl-4 pr-10 py-3 text-xs outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#9c9187]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-8 h-8 rounded-full bg-[#1b1c1a] text-white flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowRight size={12} />
              </button>
            </form>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-[11px] rounded-xl flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-600 shrink-0" />
              <span>Private invitation sent to inbox.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Bottom copyright details */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#e4e2df]/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#7A6E63] text-[9px] uppercase tracking-widest font-semibold">
        <p>© 2026 SNITCH. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#C9A96E]">Privacy Policy</a>
          <a href="#" className="hover:text-[#C9A96E]">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
