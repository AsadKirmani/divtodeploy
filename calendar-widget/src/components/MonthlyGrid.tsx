import {format } from "date-fns"

export const MonthlyGrid = ({
  carouselDates,
  emptyDays,
  currentDate,
}: {
  carouselDates: Date[];
  emptyDays: any[];
  currentDate: Date;
}) => (
  <div className="absolute top-0 inset-x-0 w-full flex flex-col gap-2 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-7 w-full mb-1">
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
        <div key={i} className="text-center text-white/50 text-xs font-medium">
          {day}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-y-2 w-full place-items-center">
      {emptyDays.map((_, i) => (
        <div key={`empty-${i}`} className="w-9 h-9"></div>
      ))}
      {carouselDates.map((date, index) => {
        const isToday = date.getDate() === currentDate.getDate();
        return (
          <button
            key={index}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${isToday ? "bg-white/30 border border-white/40 text-white shadow-inner backdrop-blur-md scale-110" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
          >
            {format(date, "d")}
          </button>
        );
      })}
    </div>
  </div>
);
