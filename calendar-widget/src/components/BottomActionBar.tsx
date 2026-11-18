import { useState } from "react";
import { format } from "date-fns";
import { FiPlus, FiEdit2 } from "react-icons/fi";

export const BottomActionBar = ({
  setIsEventSheetOpen,
  currentDate,
}: {
  setIsEventSheetOpen: (val: boolean) => void;
  currentDate: Date;
}) => {
  const [notes, setNotes] = useState<{ date: string; text: string }[]>([]);
  const [isNoteInputActive, setIsNoteInputActive] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleNoteSubmit = (e: any) => {
    if (e.key === "Enter" && noteText.trim() !== "") {
      setNotes([
        ...notes,
        { date: format(currentDate, "yyyy-MM-dd"), text: noteText },
      ]);
      setIsNoteInputActive(false);
      setNoteText("");
    }
  };

  return (
    <div className="relative z-10 flex justify-between items-center min-h-[44px]">
      {isNoteInputActive ? (
        <input
          autoFocus
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleNoteSubmit}
          onBlur={() => setIsNoteInputActive(false)}
          className="bg-white/10 text-black/50 text-sm font-medium outline-none border border-white/30 rounded-xl px-4 py-2 w-full mr-4 placeholder:text-black/40 focus:bg-white/20 focus:border-white/50 transition-all backdrop-blur-md"
          placeholder="type note & hit Enter..."
        />
      ) : (
        <button
          onClick={() => setIsNoteInputActive(true)}
          className="group text-left transition-all max-w-[200px]"
        >
          {notes.length > 0 ? (
            <div className="flex items-center gap-2.5 bg-white/10 group-hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5 backdrop-blur-sm transition-all shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(147,197,253,0.9)] shrink-0"></div>
              <span className="text-white text-sm font-medium truncate tracking-wide">
                {notes[notes.length - 1].text}
              </span>
            </div>
          ) : (
            <span className="text-white/80 group-hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors">
              <FiEdit2 size={20} /> add a note...
            </span>
          )}
        </button>
      )}
      {!isNoteInputActive && (
        <button
          onClick={() => setIsEventSheetOpen(true)}
          className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 border border-white/40 rounded-full transition-all font-medium backdrop-blur-md shadow-sm shrink-0 flex items-center justify-center gap-2"
        >
          <FiPlus size={20} /> New event
        </button>
      )}
    </div>
  );
};
