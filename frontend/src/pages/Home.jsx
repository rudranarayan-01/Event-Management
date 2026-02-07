import React, { useState } from 'react';
import { Search, Zap, ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const events = [
        { id: 1, title: "Tech Innovators Summit", date: "Oct 15, 2026", location: "Bhubaneswar", price: "Free", category: "Tech" },
        { id: 2, title: "Art & Soul Workshop", date: "Nov 02, 2026", location: "Baripada", price: "₹499", category: "Arts" },
        { id: 3, title: "Startup Pitch Day", date: "Dec 10, 2026", location: "Remote", price: "Free", category: "Business" },
    ];

    return (
        <div className="min-h-screen bg-black text-white px-6 lg:px-12 py-10">
            {/* Hero Section - Focused on Discovery */}
            <section className="mb-16 mt-8">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Zap size={18} className="text-white" />
                    <span className="uppercase tracking-[0.2em] text-xs font-semibold">Discovery Mode</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    EXPLORE. <span className="text-gray-500">ENGAGE.</span> <br />EXPERIENCE.
                </h1>
                <p className="max-w-xl text-gray-400 text-lg">
                    Find and join the most exclusive events in your area. 
                    From tech summits to local workshops, your next experience starts here.
                </p>
            </section>

            {/* Action Bar - Search Only */}
            <div className="flex items-center gap-4 mb-12">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search for events..."
                        className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:border-white outline-none transition-all"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Header */}
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                    <ArrowRight size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-500 text-sm font-mono tracking-tighter">
                    {events.length} RESULTS_FOUND
                </span>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                    .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                }
            </div>
        </div>
    );
};

export default Home;