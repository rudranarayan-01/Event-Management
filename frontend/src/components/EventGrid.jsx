import React, { useState, useEffect } from 'react'
import EventCard from './EventCard';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/api';

const EventGrid = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                // Fetching all events available on the platform
                const res = await api.get('/api/events');
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching platform events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllEvents();
    }, []);

    return (
        <div className="py-10">
            {/* Action Bar */}
            <div className="flex items-center gap-4 mb-12">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search for events, tech summits, or workshops..."
                        className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:border-white outline-none transition-all"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Header */}
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">Upcoming Events</h2>
                    <ArrowRight size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-500 text-sm font-mono tracking-tighter uppercase">
                    {events.length} PLATFORM_LISTINGS
                </span>
            </div>

            {/* Event Grid Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="text-white animate-spin mb-4" size={32} />
                    <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Fetching_Live_Feed...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events
                        .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default EventGrid