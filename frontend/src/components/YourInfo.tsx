import { format, parse } from 'date-fns';
import { ChevronLeft, MapPin, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface YourInfoProps {
  selectedDate: Date;
  selectedTime: string; // Expected format "16:30"
  onBack: () => void;
}

const YourInfo: React.FC<YourInfoProps> = ({ selectedDate, selectedTime, onBack }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  
  // State for loading and feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Combine Date and Time into a single ISO String
      // parse takes the time string "16:30" and applies it to the selectedDate object
      const parsedDateTime = parse(selectedTime, 'HH:mm', selectedDate);
      const startTimeISO = parsedDateTime.toISOString();

      // 2. Prepare the payload
      const payload = {
        firstName,
        surname,
        email,
        startTime: startTimeISO,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Automatically gets "Asia/Kolkata" etc.
        location: 'Google Meet'
      };

      // 3. API Call
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle Zod or Mongoose errors
        const msg = data.errors ? data.errors[0].message : data.message;
        throw new Error(msg || 'Something went wrong');
      }

      // 4. Success! Redirect or show success state
      console.log('Booking successful:', data);
      // Optional: Pass the booking ID to a success page
      navigate('/success', { state: { booking: data } });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col grow">
      <div className="p-10 grow">
        <h2 className="text-xl font-bold text-[#1a3a5a] mb-6">Your information</h2>

        {/* Meeting Preview */}
        <div className="mb-10 text-sm font-medium">
          <div className="text-[#1a3a5a]">
            {format(selectedDate, 'EEEE, d MMMM yyyy')} {selectedTime}{' '}
            <button onClick={onBack} className="text-[#008489] hover:underline font-bold ml-1">
              Edit
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-1">
            <MapPin size={16} className="text-gray-400" />
            <span>Google Meet</span>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 mb-2">First name *</label>
              <input
                type="text"
                placeholder='Enter your first name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 text-sm text-[#1a3a5a] border border-gray-100 rounded-md bg-[#f8fafc] outline-none focus:border-gray-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 mb-2">Surname *</label>
              <input
                type="text"
                placeholder='Enter your last name'
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-3 text-sm text-[#1a3a5a] border border-gray-100 rounded-md bg-[#f8fafc] outline-none focus:border-gray-300"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 mb-2">Your email address *</label>
            <input
              type="email"
              placeholder='johndoe@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm text-[#1a3a5a] border border-gray-100 rounded-md bg-[#f8fafc] outline-none focus:border-gray-300"
            />
          </div>
        </form>
      </div>

      {/* Footer Actions */}
      <div className="bg-[#f8fafc] px-10 py-5 border-t border-gray-100 flex items-center justify-between mt-auto">
        <button 
          onClick={onBack}
          disabled={loading}
          className="px-5 py-2.5 text-xs font-semibold text-[#1a3a5a] border border-gray-300 rounded hover:bg-white flex items-center gap-1.5 disabled:opacity-50"
        >
          <ChevronLeft size={14} />
          Back
        </button>
        <button 
          onClick={handleConfirm}
          disabled={loading}
          className="px-7 py-2.5 text-xs font-semibold text-white bg-[#4a617c] rounded hover:bg-[#3e5168] flex items-center gap-2 disabled:bg-gray-400"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default YourInfo;