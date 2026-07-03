import  { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Dashboard = () => {
  const { handleGetSellerProducts, deleteProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully");
        handleGetSellerProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
          {/* ── Top Bar ── */}
          <div className="pt-10 pb-0 flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="text-lg transition-colors duration-200 leading-none"
              style={{ color: "#B5ADA3" }}
              aria-label="Go back"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#B5ADA3")}
            >
              ←
            </button>
            <span
              className="text-xs font-medium tracking-[0.32em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
              }}
            >
              Snitch.
            </span>
          </div>

          {/* ── Page Header ── */}
          <div className="pt-10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
            <div>
              <h1
                className="text-4xl lg:text-5xl font-light leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1b1c1a",
                }}
              >
                Your Vault
              </h1>
              {/* Gold rule separator */}
              <div
                className="mt-4 w-14 h-px"
                style={{ backgroundColor: "#C9A96E" }}
              />
            </div>

            <button
              onClick={() => navigate("/seller/create-product")}
              className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 w-full md:w-auto text-center"
              style={{
                backgroundColor: "#1b1c1a",
                color: "#fbf9f6",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C9A96E";
                e.currentTarget.style.color = "#1b1c1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1b1c1a";
                e.currentTarget.style.color = "#fbf9f6";
              }}
            >
              New Listing
            </button>
          </div>

          {/* ── Product Grid ── */}
          {sellerProducts && sellerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-24">
              {sellerProducts.map((product) => {
                const imageUrl =
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : "/snitch_editorial_warm.png"; // Fallback to our warm editorial

                return (
                  <div
                    onClick={() => {
                      navigate(`/seller/product/${product._id}`);
                    }}
                    key={product._id}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Image Container */}
                    <div
                      className="aspect-[4/5] overflow-hidden mb-6 relative"
                      style={{ backgroundColor: "#f5f3f0" }}
                    >
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Delete Product Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product._id);
                        }}
                        className="absolute top-3 right-3 text-[#ba1a1a] bg-white/90 p-2 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all duration-200 cursor-pointer shadow-sm rounded-none md:opacity-0 group-hover:opacity-100"
                        title="Delete Product"
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3
                          className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: "#1b1c1a",
                          }}
                        >
                          {product.title}
                        </h3>
                      </div>

                      <p
                        className="text-[12px] line-clamp-2 leading-relaxed"
                        style={{ color: "#7A6E63" }}
                      >
                        {product.description}
                      </p>

                      <div className="mt-2">
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] font-medium"
                          style={{ color: "#1b1c1a" }}
                        >
                          {product.price?.currency}{" "}
                          {product.price?.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4"
                style={{ color: "#C9A96E" }}
              >
                Empty Vault
              </span>
              <p
                className="max-w-md mx-auto text-lg leading-relaxed"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#7A6E63",
                }}
              >
                You haven't added any curated pieces to your archive yet. Begin
                by creating a new listing.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
