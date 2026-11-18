import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const user = location.state?.user || { fullName: "Awesome Dev", email: "dev@aura.com" };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".welcome-card", {
        scaleY: 0,
        scaleX: 0.7,
        autoAlpha: 0,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "back.out(1.7)",
      });

      tl.from(
        ".card-content",
        {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex min-h-screen items-center justify-center bg-gray-50 p-6"
    >
      <div className="welcome-card w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
        
        <div className="card-content mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-500">
          👋
        </div>
        
        <h1 className="card-content mb-2 text-2xl font-bold text-gray-900 tracking-tight">
          Welcome, {user.fullName || user.email.split('@')[0]}!
        </h1>
        <p className="card-content mb-8 text-sm text-gray-500 font-medium">
          {user.email}
        </p>

        <div className="card-content rounded-xl bg-gray-50 p-4 mb-8 border border-gray-100 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Account Status
          </p>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">Active & Verified</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="card-content w-full rounded-xl bg-[#0d6efd] py-3 text-[15px] font-medium text-white transition-transform active:scale-[0.98] hover:bg-blue-700 shadow-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}