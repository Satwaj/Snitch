import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    if (!products || products.length === 0) {
      handleGetAllProducts().catch(() => {});
    }
  }, [handleGetAllProducts, products]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products || [];
    }

    return (products || []).filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";

      return (
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    });
  }, [products, query]);

  return (
    <div
      className="min-h-screen bg-[#fbf9f6] px-4 py-10 selection:bg-[#C9A96E]/30"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-10 flex flex-col gap-4 rounded-[2rem] border px-6 py-8 md:flex-row md:items-end md:justify-between"
          style={{
            borderColor: "#e4e2df",
            background:
              "linear-gradient(135deg, rgba(201,169,110,0.10), rgba(180,196,180,0.08))",
          }}
        >
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "#7A6E63" }}
            >
              Search results
            </p>
            <h1
              className="mt-2 text-4xl md:text-5xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1b1c1a",
              }}
            >
              {query ? `Matches for “${query}”` : "Browse the collection"}
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed"
              style={{ color: "#7A6E63" }}
            >
              Use the search bar to discover related products and jump directly
              to an item.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
            style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
          >
            Back to home
          </button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "/snitch_editorial_warm.png";

              return (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group flex cursor-pointer flex-col text-left"
                >
                  <div
                    className="mb-5 aspect-[4/5] overflow-hidden rounded-[1.75rem]"
                    style={{ backgroundColor: "#f5f3f0" }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3
                      className="text-xl transition-colors group-hover:text-[#C9A96E]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#1b1c1a",
                      }}
                    >
                      {product.title}
                    </h3>
                    <p
                      className="text-[12px] leading-relaxed line-clamp-2"
                      style={{ color: "#7A6E63" }}
                    >
                      {product.description}
                    </p>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: "#1b1c1a" }}
                    >
                      {product.price?.currency}{" "}
                      {product.price?.amount?.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-[2rem] border px-6 py-14 text-center"
            style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
          >
            <h2
              className="text-3xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1b1c1a",
              }}
            >
              No related products found.
            </h2>
            <p
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed"
              style={{ color: "#7A6E63" }}
            >
              Try a different keyword or browse the home page to see the full
              collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
