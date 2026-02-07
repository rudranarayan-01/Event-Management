import React from 'react';
import { Calendar, MapPin, ArrowUpRight, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    return (
        <div className="group relative bg-gray-900/40 border border-gray-800 p-6 rounded-4xl hover:border-white transition-all duration-500 cursor-pointer overflow-hidden">
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-all" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-white text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                        {event.category || 'General'}
                    </div>
                    <ArrowUpRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-500 transition-all">
                    {event.title}
                </h3>

                <div className="flex flex-col gap-2 mb-8 text-gray-500 group-hover:text-gray-300 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono">
                        <Calendar size={14} className="text-white" />
                        <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <MapPin size={14} className="text-white" />
                        <span>{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                    <div>
                        <p className="text-[8px] font-mono text-gray-500 uppercase mb-1 tracking-widest">Starting From</p>
                        <span className="text-xl font-black font-mono">₹{event.silver_price || '0'}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents the parent Card click from firing
                            navigate(`/book/${event.id}`);
                        }}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        <Ticket size={14} /> Get Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;