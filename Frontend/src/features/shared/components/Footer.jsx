

const Footer = () => {

  return (
    <footer className="w-full py-20 px-8 md:px-32 flex flex-col md:flex-row justify-between gap-12 bg-surface-container-low border-t border-outline-variant">
      <div className="space-y-6">
        <span className="text-2xl font-extrabold tracking-tighter text-primary">
          SNITCH
        </span>
        <p className="text-xs font-body text-on-surface-variant max-w-xs leading-relaxed">
          Curated essentials for the modern architect of self. Quality,
          sustainability, and effortless cool.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
            Shop
          </span>
          <span
            onClick={() => navigate("/")}
            className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            Shop All
          </span>
          <span
            onClick={() => navigate("/")}
            className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            New Arrivals
          </span>
          <span
            onClick={() => navigate("/")}
            className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            Collections
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
            Care
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            Returns
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            Shipping
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            Care Guide
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
            Brand
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            About Us
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            Sustainability
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            Journal
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          © 2026 SNITCH. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

export default Footer
