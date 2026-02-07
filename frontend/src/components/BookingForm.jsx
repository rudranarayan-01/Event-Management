import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Calendar, MapPin, ShieldCheck, Zap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import TierCard from '../components/TierCard';
import DiscussionForum from '../components/Discussion';
import { toast } from 'sonner';

const BookingPage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState('Silver');

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                toast.error("Booking fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEventData();
    }, [id]);

    const handleBooking = async () => {
        if (!user){
            toast.error("Sign in to continue")
        }

        const bookingData = {
            eventId: id,
            userId: user.id,
            userName: user.fullName,
            userEmail: user.primaryEmailAddress.emailAddress,
            ticketType: selectedTier,
            paymentStatus: 'PAID'
        };

        try {
            await axios.post('http://localhost:5000/api/registrations', bookingData);
            toast.success('RESERVATION_CONFIRMED', {
                description: `Your ${selectedTier} ticket is secured for ${event.title}.`,
                style: {
                    background: '#000',
                    color: '#fff',
                    border: '1px solid #333',
                    fontFamily: 'monospace'
                },
            });
            navigate('/');
        } catch (err) {
            toast.error("Booking failed. Please try again.");
        }
    };

    if (loading) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest">Initialising_Secure_Checkout...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white px-6 lg:px-12 py-10">
            {/* Header & Back Navigation */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-xs font-mono uppercase tracking-widest">Back to Explore</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">

                {/* Left: Event Information */}
                <section className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-4 font-mono text-[10px] uppercase tracking-widest">
                            <Zap size={14} className="text-white" /> Secure Registration
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-6">
                            {event.title}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-y border-gray-800 py-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-mono text-gray-500 uppercase">Venue</p>
                            <div className="flex items-center gap-2 font-bold"><MapPin size={16} /> {event.location}</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-mono text-gray-500 uppercase">Schedule</p>
                            <div className="flex items-center gap-2 font-bold"><Calendar size={16} /> {new Date(event.dateTime).toLocaleDateString()}</div>
                        </div>
                    </div>
                </section>

                {/* Right: Ticket Selection (Requirements Check) */}
                <section className="bg-gray-900/30 border border-gray-800 rounded-[3rem] p-10 h-fit sticky top-24">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-center">Select_Your_Tier</h2>

                    <div className="space-y-4 mb-10">
                        <TierCard
                            type="Silver"
                            price={event.silver_price}
                            active={selectedTier === 'Silver'}
                            onClick={() => setSelectedTier('Silver')}
                            perks={["Standard Seating", "Community Access"]}
                        />
                        <TierCard
                            type="Gold"
                            price={event.gold_price}
                            active={selectedTier === 'Gold'}
                            onClick={() => setSelectedTier('Gold')}
                            perks={["Premium Seating", "Networking Lunch", "Digital Certificate"]}
                        />
                        <TierCard
                            type="Diamond"
                            price={event.diamond_price}
                            active={selectedTier === 'Diamond'}
                            onClick={() => setSelectedTier('Diamond')}
                            perks={["Front Row Access", "Private Dinner", "VIP Lounge", "Exclusive Merch"]}
                        />
                    </div>

                    <button
                        onClick={handleBooking}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                    >
                        Confirm Reservation
                    </button>
                </section>
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <DiscussionForum eventId={id} />
                </section>
            </div>
        </div>
    );
};



export default BookingPage;