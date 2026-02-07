import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Users, Ticket, Bell, Settings, Search,
  Mail, Download, Zap, ArrowLeft, X, Loader2
} from 'lucide-react';
import EditModal from './EditModal';
import { toast } from 'sonner';

const EventControlPanel = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);

  // Fetch Event Details & Attendees on Load
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEventData(res.data);

        // Fetch Attendees 
        const attendeeRes = await axios.get(`http://localhost:5000/api/events/${id}/attendees`);
        setAttendees(attendeeRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-gray-500">
      <Loader2 className="animate-spin mb-4" />
      <p className="font-mono text-xs uppercase tracking-widest">Accessing_Event_Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 lg:px-12 py-10">

      {/* 1. TOP NAV */}
      <div className="flex justify-between items-center mb-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-xs font-mono uppercase tracking-widest">Back to All Events</span>
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white hover:text-black transition-all"
          >
            <Settings size={14} /> Edit Event
          </button>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase">{eventData?.title}</h1>
        <p className="text-gray-500 font-mono text-xs mt-1 italic">ID // {id}</p>
      </header>

      {/* 3. TABS */}
      <div className="flex gap-10 border-b border-gray-800 mb-10">
        {['overview', 'attendees', 'communications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-300'
              }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white animate-in slide-in-from-left" />}
          </button>
        ))}
      </div>

      {/* 4. CONTENT */}
      <div className="space-y-8">
        {activeTab === 'overview' && <OverviewTab event={eventData} attendeeCount={attendees.length} />}
        {activeTab === 'attendees' && <AttendeeTab attendees={attendees} />}
        {activeTab === 'communications' && <CommTab eventId={id} />}
      </div>

      {/* 5. EDIT MODAL */}
      {isEditModalOpen && (
        <EditModal
          event={eventData}
          close={() => setIsEditModalOpen(false)}
          refresh={(updated) => setEventData(updated)}
        />
      )}
    </div>
  );
};

/* --- TAB COMPONENTS --- */

const OverviewTab = ({ event, attendeeCount }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatBox label="Total Registrations" value={attendeeCount} change="+Live" />
      <StatBox label="Silver Price" value={`₹${event.silver_price}`} change="Rate" />
      <StatBox label="Gold Price" value={`₹${event.gold_price}`} change="Rate" />
      <StatBox label="Diamond Price" value={`₹${event.diamond_price}`} change="Rate" />
      <StatBox
        label="Accumulated Revenue"
        value={`₹${event.accumulatedRevenue.toLocaleString()}`}
        change="+Growth"
        isHighlight={true}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6 italic tracking-tight uppercase">Event_Configuration</h3>
        <div className="grid grid-cols-2 gap-y-6 text-sm">
          <div>
            <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Venue</p>
            <p className="font-medium">{event.location}</p>
          </div>
          <div>
            <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Scheduled Time</p>
            <p className="font-medium text-gray-300">{new Date(event.dateTime).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Description</p>
            <p className="text-gray-400 text-xs leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-3xl">
        <h3 className="text-lg font-bold italic tracking-tight uppercase mb-6">Inventory Status</h3>
        <ProgressBar label="Total Capacity Usage" current={attendeeCount} total={100} />
      </div>
    </div>
  </div>
);

const AttendeeTab = ({ attendees }) => (
  <div className="bg-gray-900/20 border border-gray-800 rounded-3xl overflow-hidden">
    <table className="w-full text-left text-sm">
      <thead className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800 font-mono">
        <tr>
          <th className="px-6 py-4">Attendee Name</th>
          <th className="px-6 py-4">Tier</th>
          <th className="px-6 py-4 text-right">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {attendees.map((person) => (
          <tr key={person.id} className="hover:bg-white/2 transition-colors">
            <td className="px-6 py-4 font-medium italic">{person.userName || person.userEmail}</td>
            <td className="px-6 py-4 text-gray-500 font-mono text-xs uppercase">{person.ticketType}</td>
            <td className="px-6 py-4 text-right text-green-500 font-mono text-[10px]">VERIFIED_PAID</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CommTab = ({ eventId, eventTitle }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.")
    }

    setSending(true);
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/broadcast`, {
        message,
        eventTitle
      });
      toast.success('Broadcast Successful', {
        style: {
          background: '#000',
          color: '#fff',
          border: '1px solid #333',
          fontFamily: 'monospace'
        },
      });
      setMessage("");
    } catch (err) {
      toast.error("Error sending broadcast. Check backend logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Mail size={18} /> Broadcast Message
        </h3>
        <p className="text-[10px] text-gray-500 font-mono uppercase mb-4 tracking-widest">
          Sending to all registered attendees
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-black border border-gray-800 p-4 rounded-2xl mb-4 focus:border-white outline-none transition-all min-h-[150px] text-sm"
          placeholder="Write your update here..."
        />
        <button
          onClick={handleBroadcast}
          disabled={sending}
          className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all disabled:bg-gray-800 disabled:text-gray-500 flex justify-center items-center gap-2"
        >
          {sending ? (
            <> <Loader2 size={14} className="animate-spin" /> DISPATCHING... </>
          ) : (
            "DISPATCH EMAIL"
          )}
        </button>
      </div>
    </div>
  );
};



/* --- STAT BOX COMPONENT --- */

const StatBox = ({ label, value, change, isHighlight }) => (
  <div className={`p-5 rounded-2xl border ${
    isHighlight 
    ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]' 
    : 'bg-gray-900/30 border-gray-800 text-white'
  }`}>
    <p className={`text-[9px] font-mono uppercase tracking-widest mb-2 ${
      isHighlight ? 'text-black/60' : 'text-gray-500'
    }`}>{label}</p>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-black tracking-tighter">{value}</p>
      <span className={`text-[10px] font-mono ${isHighlight ? 'text-green-600' : 'text-green-500'}`}>
        {change}
      </span>
    </div>
  </div>
);

const ProgressBar = ({ label, current, total }) => (
  <div>
    <div className="flex justify-between text-[10px] font-mono mb-2">
      <span className="text-gray-400 uppercase">{label}</span>
      <span className="text-white">{current}/{total}</span>
    </div>
    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
      <div className="bg-white h-full transition-all" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
  </div>
);

export default EventControlPanel;