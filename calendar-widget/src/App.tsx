import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import gsap from "gsap";
import { BackgroundOrbs } from "./components/Background";
import { TopBar } from "./components/TopBar";
import { DateHeader } from "./components/DateHeader";
import { WeeklyCarousel } from "./components/WeeklyCarousel";
import { MonthlyGrid } from "./components/MonthlyGrid";
import { BottomActionBar } from "./components/BottomActionBar";
import { EventSheet } from "./components/EventSheet";

export default function CalendarWidget() {
  const [currentDate, _setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("weekly");
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);

  const cardRef = useRef(null);
  const mainContentRef = useRef(null);
  const carouselDates = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: endOfMonth(currentDate) });
  }, [currentDate]);

  const startDayOfMonth = getDay(startOfMonth(currentDate));
  const emptyDays = Array.from({ length: startDayOfMonth });

  const currentIndex = useMemo(() => {
    return carouselDates.findIndex((d) => d.getDate() === currentDate.getDate());
  }, [carouselDates, currentDate]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        { scale: 1, opacity: 1, duration: 1.7, ease: "elastic.out(1, 0.75)" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden relative">
      <BackgroundOrbs />

      <div ref={cardRef} className="relative z-10 w-full max-w-md min-h-[300px] rounded-[2rem] backdrop-blur-3xl bg-white/10 shadow-xl ring-1 ring-white/50 flex flex-col p-6 overflow-hidden">
        
        <div ref={mainContentRef} className="flex flex-col gap-8 w-full h-full">
          <TopBar viewMode={viewMode} setViewMode={setViewMode} />
          <DateHeader currentDate={currentDate} />
          
          <div className="relative z-10 w-full transition-[height] duration-500 ease-out overflow-visible" style={{ height: viewMode === "weekly" ? "128px" : "290px" }}>
            {viewMode === "weekly" ? (
              <WeeklyCarousel viewMode={viewMode} carouselDates={carouselDates} currentIndex={currentIndex} />
            ) : (
              <MonthlyGrid currentDate={currentDate} carouselDates={carouselDates} emptyDays={emptyDays} />
            )}
          </div>

          <BottomActionBar setIsEventSheetOpen={setIsEventSheetOpen} currentDate={currentDate} />
        </div>

        <EventSheet isEventSheetOpen={isEventSheetOpen} setIsEventSheetOpen={setIsEventSheetOpen} mainContentRef={mainContentRef} />
      </div>
    </div>
  );
}
