import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "U";

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-[#fbf9f6] px-4 py-10 selection:bg-[#C9A96E]/30"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside
            className="rounded-[2rem] border p-6"
            style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] text-2xl font-semibold"
                style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
              >
                {initials}
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "#7A6E63" }}
                >
                  Account
                </p>
                <h1
                  className="mt-1 text-3xl"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#1b1c1a",
                  }}
                >
                  {user?.fullname || "Guest"}
                </h1>
                <p className="text-sm" style={{ color: "#7A6E63" }}>
                  {user?.role || "Member"}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="w-full rounded-full border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                style={{ borderColor: "#e4e2df", color: "#1b1c1a" }}
              >
                Continue shopping
              </button>

              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors"
                style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
              >
                Log out
              </button>
            </div>
          </aside>

          <section
            className="rounded-[2rem] border p-6 md:p-8"
            style={{
              borderColor: "#e4e2df",
              background:
                "linear-gradient(135deg, rgba(201,169,110,0.08), rgba(255,255,255,1))",
            }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "#7A6E63" }}
            >
              Manage account
            </p>
            <h2
              className="mt-2 text-4xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1b1c1a",
              }}
            >
              Account details
            </h2>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed"
              style={{ color: "#7A6E63" }}
            >
              Review your current account information and use the navbar profile
              menu to move between shopping and account actions.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div
                className="rounded-[1.5rem] border p-5"
                style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#7A6E63" }}
                >
                  Email
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#1b1c1a" }}
                >
                  {user?.email || "Not available"}
                </p>
              </div>

              <div
                className="rounded-[1.5rem] border p-5"
                style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#7A6E63" }}
                >
                  Contact
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#1b1c1a" }}
                >
                  {user?.contact || "Not available"}
                </p>
              </div>

              <div
                className="rounded-[1.5rem] border p-5"
                style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#7A6E63" }}
                >
                  Role
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#1b1c1a" }}
                >
                  {user?.role || "Member"}
                </p>
              </div>

              <div
                className="rounded-[1.5rem] border p-5"
                style={{ borderColor: "#e4e2df", backgroundColor: "#fff" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#7A6E63" }}
                >
                  Status
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#1b1c1a" }}
                >
                  Active session
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
