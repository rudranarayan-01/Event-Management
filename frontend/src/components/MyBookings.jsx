import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, Trash2, Loader2, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from "../../api/api";

/**
 * CHILD COMPONENT: Handles the "Delete" action
 */
const CancelBooking = ({ registrationId, userId, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        // Safety check to ensure IDs are present before firing the request
        if (!registrationId || !userId) {
            toast.error("Error: Missing booking identification");
            return;
        }

        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setLoading(true);
        try {
            // In Axios DELETE, the body must be wrapped in a 'data' object
            const response = await api.delete(`/registrations/${registrationId}`, {
                data: { userId } 
            });
            
            if (response.data.success) {
                toast.success("Booking successfully removed");
                onCancelSuccess(registrationId);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to cancel";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all border bg-red-600/10 border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {loading ? "PROCESSING..." : "CANCEL_BOOKING"}
        </button>
    );
};

/**
 * MAIN PAGE COMPONENT
 */
const MyBookings = () => {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/registrations/user/${user.id}`);
                setBookings(res.data);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setFetching(false);
            }
        };
        fetchBookings();
    }, [user, bookings]);

    // Updates state to remove the deleted item from the screen instantly
    const handleCancelSuccess = (deletedId) => {
        setBookings(prev => prev.filter(item => item.id !== deletedId));
    };

    if (fetching) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-gray-500 font-mono">
            <Loader2 className="animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest">Initialising_Secure_List...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white px-6 lg:px-12 py-10">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 border-b border-gray-900 pb-8">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
                        My <span className="text-red-600">Registrations</span>
                    </h1>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">
                        Verified_User_Events // {user?.fullName || "User"}
                    </p>
                </header>

                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-[3rem] bg-gray-900/10">
                        <Inbox className="text-gray-700 mb-4" size={48} />
                        <p className="text-gray-500 font-mono text-xs mb-6 uppercase tracking-widest text-center">No_Active_Reservations_Found</p>
                        <Link to="/" className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-gray-200 transition-all">
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <div 
                                key={booking.id} 
                                className="group flex justify-between items-center p-6 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-gray-600 transition-all"
                            >
                                <div className="space-y-1">
                                    <span>{booking.id}</span>
                                    <h3 className="text-xl font-bold uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
                                        {booking.eventTitle || "Untitled Event"}
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-500 font-mono text-xs uppercase">
                                        <Calendar size={14} />
                                        {booking.eventDate || "Date_Not_Set"}
                                    </div>
                                </div>

                                <CancelBooking
                                    registrationId={booking.registrationId} 
                                    userId={user.id}
                                    onCancelSuccess={handleCancelSuccess}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;