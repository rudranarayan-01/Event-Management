import React, { useState } from 'react';
import {  Zap,  } from 'lucide-react';
import EventGrid from '../components/EventGrid';

const Home = () => {
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
        
        <EventGrid/>
        </div>
    );
};

export default Home;