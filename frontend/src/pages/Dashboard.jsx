import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Plus, Users, Ticket, Activity, Edit3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();

  // Mock data for the manager's created events
  const myEvents = [
    { id: 1, title: "Tech Innovators Summit", sales: 120, revenue: "₹0", status: "Live" },
    { id: 2, title: "Art & Soul Workshop", sales: 45, revenue: "₹22,455", status: "Draft" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">WELCOME_BACK // {user?.firstName?.toUpperCase()}</p>
        </div>
        <Link to="/create-event" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
          <Plus size={20} /> New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<Users size={20}/>} label="Total Attendees" value="165" />
        <StatCard icon={<Ticket size={20}/>} label="Tickets Sold" value="212" />
        <StatCard icon={<Activity size={20}/>} label="Active Events" value="2" />
      </div>

      {/* Management Table */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Events</h2>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Live Tracking</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tickets</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {myEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium">{event.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${event.status === 'Live' ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{event.sales}</td>
                  <td className="px-6 py-4 text-gray-400">{event.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl group hover:border-gray-500 transition-all">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 bg-black border border-gray-800 rounded-lg text-white group-hover:bg-white group-hover:text-black transition-all">
        {icon}
      </div>
      <span className="text-gray-500 text-sm font-medium">{label}</span>
    </div>
    <div className="text-4xl font-bold tracking-tight">{value}</div>
  </div>
);

export default Dashboard;