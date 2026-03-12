import { useMemo, useState } from "react";
import type { Timezone } from "../types";
import { Search, ChevronDown } from 'lucide-react';

const timezones: Timezone[] = [
  { label: "UTC +05:00 Almaty, Aqtau, Aqtobe", value: "UTC+05:00" },
  { label: "UTC +05:30 New Delhi, Mumbai, Calcutta", value: "UTC+05:30" },
  { label: "UTC +05:45 Kathmandu, Katmandu", value: "UTC+05:45" },
  { label: "UTC +06:00 Bishkek, Dacca, Dhaka", value: "UTC+06:00" },
];

const TimezoneSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Timezone>(timezones[1]);

  const filtered = useMemo(() => 
    timezones.filter(tz => tz.label.toLowerCase().includes(search.toLowerCase())), 
  [search]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[13px] font-bold text-[#008489] hover:opacity-80 transition-opacity"
      >
        <span className="truncate max-w-70">{selected.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="absolute z-50 w-full mt-4 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] top-full animate-in fade-in zoom-in-95 duration-200">
            {/* The Design Pointer (Triangle) */}
            <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white" />
            
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full py-2.5 pl-3 pr-10 text-sm border border-cyan-400/50 rounded-lg outline-none focus:border-cyan-500 transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <Search size={16} className="absolute text-cyan-500 right-3 top-3" />
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.map((tz, i) => (
                <div 
                  key={i} 
                  onClick={() => { setSelected(tz); setIsOpen(false); }}
                  className={`px-4 py-3 text-[12px] cursor-pointer transition-colors border-b border-gray-50 last:border-0
                    ${selected.value === tz.value ? 'bg-cyan-50 text-cyan-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tz.label}
                </div>
              ))}
              {filtered.length === 0 && <div className="p-4 text-xs text-gray-400 text-center">No results</div>}
            </div>
          </div>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
};

export default TimezoneSelector