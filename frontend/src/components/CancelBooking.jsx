import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner'; // Using sonner for consistent UI
import { Trash2, Loader2 } from 'lucide-react';

const CancelBooking = ({ registrationId, userId, onCancelSuccess }) => {
    console.log("PROPS RECEIVED -> registrationId:", registrationId, "userId:", userId);
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        // Double check we have the IDs needed
        if (!registrationId || !userId) {
            console.log("Registration Id:",registrationId)
            console.log("Userid:",userId)
            toast.error("Invalid booking reference");
            return;
        }

        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setLoading(true);
        try {
            // Note: Axios DELETE requires the body to be under the 'data' key
            const response = await api.delete(`/registrations/${registrationId}`, {
                data: { userId }
            });
            
            if (response.data.success) {
                toast.success("Booking cancelled successfully");
                // Notify parent to remove this specific ID from the list
                onCancelSuccess(registrationId);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to cancel registration";
            toast.error(errorMsg);
            console.error("Cancellation error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCancel}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 border ${
                loading 
                ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600/10 border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]'
            }`}
        >
            {loading ? (
                <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <Trash2 size={14} />
                    Cancel_Booking
                </>
            )}
        </button>
    );
};

export default CancelBooking;