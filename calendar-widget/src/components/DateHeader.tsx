import { format } from "date-fns"

export const DateHeader = ({ currentDate }: { currentDate: Date }) => (
  <div className="relative z-10 text-6xl text-white font-medium tracking-tight drop-shadow-sm">
    {format(currentDate, "MMMM d")}
  </div>
);
