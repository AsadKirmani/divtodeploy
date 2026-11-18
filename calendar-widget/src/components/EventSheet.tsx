import { useRef, useLayoutEffect } from "react";
import { FiX } from "react-icons/fi";
import gsap from "gsap";

export const EventSheet = ({
  isEventSheetOpen,
  setIsEventSheetOpen,
  mainContentRef,
}: {
  isEventSheetOpen: boolean;
  setIsEventSheetOpen: (val: boolean) => void;
  mainContentRef: any;
}) => {
  const eventSheetRef = useRef(null);
  const sheetTl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!mainContentRef.current || !eventSheetRef.current) return;
    const ctx = gsap.context(() => {
      sheetTl.current = gsap
        .timeline({ paused: true })
        .to(
          mainContentRef.current,
          {
            scale: 0.92,
            opacity: 0.5,
            filter: "blur(6px)",
            duration: 0.5,
            ease: "power3.out",
            transformOrigin: "top center",
          },
          0,
        )
        .to(
          eventSheetRef.current,
          { y: "0%", duration: 0.5, ease: "expo.out" },
          0,
        );
    });
    return () => ctx.revert();
  }, [mainContentRef]);

  useLayoutEffect(() => {
    if (sheetTl.current) {
      isEventSheetOpen ? sheetTl.current.play() : sheetTl.current.reverse();
    }
  }, [isEventSheetOpen]);

  return (
    <div
      ref={eventSheetRef}
      className="absolute inset-x-0 bottom-0 h-[80%] bg-slate-400/40 backdrop-blur-2xl border-t border-white/20 rounded-t-[2.5rem] p-6 flex flex-col gap-6 translate-y-full z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-2"></div>
      <div className="flex justify-between items-center mt-2">
        <h3 className="text-xl text-white font-semibold tracking-wide">
          New Event
        </h3>
        <button
          onClick={() => setIsEventSheetOpen(false)}
          className="bg-white/10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <input
          type="text"
          placeholder="Event Title..."
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 outline-none focus:bg-white/20 focus:border-white/50 transition-all"
        />
        <div className="flex gap-4">
          <input
            type="time"
            defaultValue="10:00"
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white flex-1 outline-none focus:bg-white/20 focus:border-white/50 transition-all"
            style={{ colorScheme: "dark" }}
          />
          <input
            type="time"
            defaultValue="11:00"
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white flex-1 outline-none focus:bg-white/20 focus:border-white/50 transition-all"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>
      <button
        onClick={() => setIsEventSheetOpen(false)}
        className="mt-auto mb-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold tracking-wide py-3.5 rounded-xl shadow-lg shadow-black/10 backdrop-blur-md transition-all active:scale-[0.98]"
      >
        Create Event
      </button>
    </div>
  );
};
