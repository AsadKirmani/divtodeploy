import { FiSettings } from "react-icons/fi";

export const TopBar = ({
  viewMode,
  setViewMode,
}: {
  viewMode: string;
  setViewMode: (val: string) => void;
}) => (
  <div className="relative z-10 flex justify-between items-center">
    <div className="relative flex p-1 bg-white/20 rounded-full backdrop-blur-md shadow-xs w-[180px]">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-500 ease-out ${viewMode === "monthly" ? "translate-x-full" : "translate-x-0"}`}
      ></div>
      <button
        onClick={() => setViewMode("weekly")}
        className={`relative z-10 flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors duration-300 ${viewMode === "weekly" ? "text-slate-800" : "text-white/70 hover:text-white"}`}
      >
        Weekly
      </button>
      <button
        onClick={() => setViewMode("monthly")}
        className={`relative z-10 flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors duration-300 ${viewMode === "monthly" ? "text-slate-800" : "text-white/70 hover:text-white"}`}
      >
        Monthly
      </button>
    </div>
    <div className="rounded-full bg-white/20 backdrop-blur-md w-10 h-10 flex justify-center items-center hover:bg-white/30 transition-colors cursor-pointer">
      <FiSettings size={20} className="text-white" />
    </div>
  </div>
);
