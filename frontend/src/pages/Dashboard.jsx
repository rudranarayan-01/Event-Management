import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, MapPin, Calendar, Users, 
  Ticket, ArrowUpRight, LayoutGrid, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/api';

const Dashboard = () => {
  const { user } = useUser();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerEvents = async () => {
      if (!user) return;
      
      try {
        const response = await api.get(`/manager/events/${user.id}`);
        setMyEvents(response.data);
      } catch (error) {
        toast.error("Error fetching manager events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerEvents();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <LayoutGrid size={14} className="text-white" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Manager Command Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">ALL_EVENTS</h1>
          <p className="text-gray-500 font-mono text-[10px] mt-1 italic">
            ACTIVE_SESSION // {user?.firstName?.toUpperCase() || "ADMIN"}
          </p>
        </div>
        
        <Link to="/create-event" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Plus size={18} /> New Event
        </Link>
      </div>

      {/* 2. LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="font-mono text-xs uppercase tracking-widest">Synchronizing_Database...</p>
        </div>
      ) : myEvents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-[2.5rem]">
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">No events found for this account</p>
          <Link to="/create-event" className="text-white underline text-sm font-bold">Create your first event</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myEvents.map((event) => {
            // Note: In a real app, 'totalCapacity' and 'totalBookings' would come from registration counts
            // For now, we'll use a placeholder or add these columns to your SQLite table
            const totalCapacity = 100; 
            const totalBookings = event.totalBookings || 0; 
            const availableTickets = totalCapacity - totalBookings;
            
            return (
              <Link 
                to={`/dashboard/event/${event.id}`} 
                key={event.id}
                className="group relative bg-gray-900/30 border border-gray-800 p-8 rounded-[2.5rem] hover:border-white transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  
                  {/* Left: Event Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ID: {event.id.slice(0, 8)}...</span>
                      <h3 className="text-2xl font-bold tracking-tight group-hover:tracking-wider transition-all duration-500">
                        {event.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-400">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} className="text-white" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-white" />
                        <span className="font-mono">{new Date(event.dateTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Status */}
                  <div className="flex flex-wrap items-center gap-8 lg:text-right">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Total Bookings</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Users size={14} className="text-gray-400" />
                        <p className="text-xl font-black tracking-tighter">{totalBookings}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Available Tickets</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Ticket size={14} className="text-gray-400" />
                        <p className="text-xl font-black tracking-tighter text-green-500">{availableTickets}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-l border-gray-800 pl-8 ml-4">
                       <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase bg-white text-black`}>
                          LIVE
                        </div>
                        <ArrowUpRight className="text-gray-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 w-full bg-gray-800 h-0.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-1000 group-hover:bg-green-500" 
                    style={{ width: `${(totalBookings / totalCapacity) * 100}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;