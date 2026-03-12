import { ChevronLeft, ChevronRight, MapPin, Loader2 } from "lucide-react";
import TimezoneSelector from "./TimeZoneSelector";
import YourInfo from "./YourInfo";
import { DayPicker, type Matcher } from "react-day-picker";
import { format, isBefore, isWeekend, startOfToday } from "date-fns";
import { useState, useEffect } from "react";
import Stepper from "./Stepper";
import { Link } from "react-router-dom";

const ClimatiqScheduler: React.FC = () => {
  const [step, setStep] = useState<'scheduler' | 'info'>('scheduler');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 2, 11));
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // API integration state
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = startOfToday();
  const disabledDays: Matcher = (date: Date) => isBefore(date, today) || isWeekend(date);

  // --- API INTEGRATION ---
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      setIsLoading(true);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/bookings/availability?date=${formattedDate}&timezone=${tz}`
        );
        const result = await response.json();

        if (result.success) {
          setAvailableSlots(result.data);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setStep('info');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f7f9] p-4 font-sans antialiased">
         <button className=" absolute top-0 right-10 mt-8 border px-2 py-2 rounded-2xl hover:opacity-100 transition-opacity">
          <Link to="/admin" className="text-lg text-black">Admin Dashboard</Link>
          </button>
        {/* 1. STEPPER CONTAINER - Positioned at the top of the card's width */}
      <div className="w-full max-w-4xl mb-12 flex justify-center">
        <div className="w-[42%]"> {/* This keeps the stepper aligned with the sidebar */}
          <Stepper currentStep={step === 'scheduler' ? 1 : 2} />
        </div>
      </div>

      {/* 2. MAIN CARD */}
      <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.05)] min-h-162.5">
        
        {/* LEFT SIDEBAR (Hidden on 'info' step to allow full-width form) */}
        {step === 'scheduler' && (
          <div className="w-[42%] bg-[#4a617c] p-8 text-white flex flex-col items-center shrink-0 border-r border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl font-light rounded-full bg-white/20">V</div>
            <h2 className="mb-8 text-xl font-medium text-center">Meet with Victoire Serruys</h2>
            
            <div className="w-full">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDays}
                defaultMonth={new Date(2026, 2)}
                fixedWeeks
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-6",
                  month_caption: "flex items-center justify-between h-10 mb-4 w-full relative", 
                  nav: "absolute inset-0 flex items-center justify-between w-full z-10 pointer-events-none",
                  button_previous: "pointer-events-auto hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center min-w-[32px]",
                  button_next: "pointer-events-auto hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center min-w-[32px]",
                  caption_label: "text-sm font-bold w-full text-center block", 
                  month_grid: "w-full border-collapse",
                  weekdays: "flex w-full mb-2",
                  weekday: "text-[10px] font-bold opacity-60 uppercase tracking-tighter w-full text-center py-2",
                  week: "flex w-full mt-2",
                  day: "h-10 w-full text-[12px] p-0 font-normal rounded-full hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center",
                  day_button: "w-full h-full flex items-center justify-center",
                  selected: "bg-white !text-[#4a617c] font-bold rounded-full",
                  disabled: "opacity-20 cursor-not-allowed",
                  today: "border border-white/30 rounded-full",
                }}
                components={{
                  Chevron: (props) => (
                    props.orientation === 'left' 
                      ? <ChevronLeft size={16} className="text-white" /> 
                      : <ChevronRight size={16} className="text-white" />
                  )
                }}
              />
            </div>
          </div>
        )}

        {/* RIGHT SIDE / MAIN CONTENT */}
        <div className={`${step === 'scheduler' ? 'w-[58%]' : 'w-full'} flex flex-col bg-white`}>
          {step === 'scheduler' ? (
            <div className="p-10 flex flex-col h-full">
              <section className="mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Meeting location</h3>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <MapPin size={16} className="text-gray-400" />
                  <span>Google Meet</span>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Meeting duration</h3>
                <div className="w-full py-2.5 text-xs font-semibold text-center text-[#4a617c] bg-[#dce4ec] rounded-md">30 mins</div>
              </section>

              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-[#1a3a5a]">What time works best?</h3>
                <p className="mb-4 text-xs text-gray-500">
                  Showing times for <span className="font-bold">{selectedDate ? format(selectedDate, 'd MMMM yyyy') : 'Select a date'}</span>
                </p>

                <TimezoneSelector />

                {/* Time Slots Container */}
                <div className="mt-6 space-y-2 overflow-y-auto max-h-75 pr-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <Loader2 className="animate-spin text-[#008489]" size={24} />
                      <span className="text-xs text-gray-400 font-medium">Loading availability...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeClick(time)}
                        className="w-full py-3.5 text-sm font-semibold text-[#4a617c] transition-all border border-gray-100 rounded-md hover:border-[#008489] hover:text-[#008489] hover:bg-[#f0f9f9] active:scale-[0.98]"
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm text-gray-400">No available slots for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <YourInfo
              selectedDate={selectedDate || new Date()} 
              selectedTime={selectedTime} 
              onBack={() => setStep('scheduler')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimatiqScheduler;