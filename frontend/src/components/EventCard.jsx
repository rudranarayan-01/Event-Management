import React from 'react';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const EventCard = ({ event }) => {
    return (
        <div className="group relative bg-gray-900/50 border border-gray-800 p-6 rounded-3xl hover:border-white transition-all duration-500 cursor-pointer">
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-white text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                        {event.category}
                    </div>
                    <ArrowUpRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:tracking-wide transition-all">
                    {event.title}
                </h3>

                <div className="flex flex-col gap-2 mb-8 text-gray-500 group-hover:text-gray-300 transition-colors">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar size={14} /> <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} /> <span>{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800 group-hover:border-gray-700">
                    <span className="text-xl font-mono font-bold">{event.price}</span>
                    <button className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white underline underline-offset-8">
                        Get Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;