import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Calendar, User, Mail, Clock, ShieldCheck, Trash2, AlertCircle } from "lucide-react";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  time: string;
  timezone: string;
}

const AdminView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/bookings`);
      const result = await response.json();
      
      if (result.success) {
        setBookings(result.data);
      } else {
        setError("Failed to load bookings. Please check your API.");
      }
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
      console.error("Admin fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setBookings(bookings.filter(b => b._id !== id));
      }
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#4a617c] mb-2" size={32} />
        <p className="text-gray-500 font-medium">Fetching dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-8 font-sans antialiased text-[#1a3a5a]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a3a5a] flex items-center gap-2">
              <ShieldCheck className="text-[#008489]" size={28} />
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Manage and view all scheduled meetings</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={fetchAllBookings}
              className="px-4 py-2 text-xs font-bold text-[#4a617c] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Refresh Data
            </button>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
              <span className="text-lg font-bold text-[#4a617c] leading-none">{bookings.length}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-3 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 text-[11px] font-bold uppercase text-gray-400 tracking-widest">Attendee</th>
                  <th className="p-5 text-[11px] font-bold uppercase text-gray-400 tracking-widest">Date & Time</th>
                  <th className="p-5 text-[11px] font-bold uppercase text-gray-400 tracking-widest">Timezone</th>
                  <th className="p-5 text-[11px] font-bold uppercase text-gray-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    // SAFE DATE PARSING
                    const parseDate = (dateStr: string) => {
                      const d = new Date(dateStr);
                      return isNaN(d.getTime()) ? null : d;
                    };
                    const validDate = parseDate(booking.date);

                    return (
                      <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1a3a5a] flex items-center gap-2">
                              <User size={14} className="text-gray-400" />
                              {booking.firstName} {booking.lastName}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                              <Mail size={12} />
                              {booking.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#4a617c] flex items-center gap-2">
                              <Calendar size={14} className="opacity-70" />
                              {validDate ? format(validDate, 'PPP') : 'Invalid Date'}
                            </span>
                            <span className="text-xs text-[#008489] font-bold flex items-center gap-2 mt-0.5">
                              <Clock size={12} />
                              {booking.time}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="inline-block px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-500 rounded tracking-tight">
                            {booking.timezone}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => handleDelete(booking._id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                         <Calendar size={48} className="mb-4 text-gray-300" />
                         <p className="text-sm font-medium italic">No bookings scheduled yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Internal Use Only • Climatiq x Tese</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminView;