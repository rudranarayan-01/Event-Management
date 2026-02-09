import React from 'react';
import { useForm } from 'react-hook-form';
import {  MapPin, Ticket, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'; 
import api from '../../api/api';
import { toast } from 'sonner';

const CreateEvent = () => {
    const { user } = useUser(); 
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const eventPayload = {
            managerId: user?.id, // Dynamic ID from Clerk
            title: data.title,
            description: data.description,
            location: data.location,
            dateTime: data.dateTime,
            privacy: data.privacy,
            silver: parseInt(data.silver), 
            gold: parseInt(data.gold),
            diamond: parseInt(data.diamond)
        };

        try {
            const response = await api.post('/events', eventPayload);
            if (response.status === 201) {
                toast.success("Event Published Successfully!");
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error publishing event:", error);
            toast.error("Failed to publish event. Please check if the backend is running.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8">
                <ArrowLeft size={18} />
                <span className="text-sm font-mono uppercase tracking-widest">Back to Dashboard</span>
            </Link>

            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">CREATE_NEW_EVENT</h1>
                    <p className="text-gray-500">Logged in as: <span className="text-white font-mono">{user?.primaryEmailAddress?.emailAddress}</span></p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

                    {/* Section 1: Basic Information */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-white/50 border-b border-gray-800 pb-2">
                            <ImageIcon size={18} />
                            <h2 className="text-xs font-black uppercase tracking-widest">Basic Details</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="group">
                                <label className="block text-xs font-mono text-gray-500 mb-2">EVENT TITLE</label>
                                <input
                                    {...register("title", { required: true })}
                                    placeholder="e.g. Future Tech Conference 2026"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-mono text-gray-500 mb-2">DESCRIPTION</label>
                                <textarea
                                    {...register("description")}
                                    rows="4"
                                    placeholder="What is this event about?"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Date & Location */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-white/50 border-b border-gray-800 pb-2">
                            <MapPin size={18} />
                            <h2 className="text-xs font-black uppercase tracking-widest">Date & Venue</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2">DATE & TIME</label>
                                <input
                                    type="datetime-local"
                                    {...register("dateTime", { required: true })}
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2">LOCATION</label>
                                <input
                                    {...register("location", { required: true })}
                                    placeholder="City or 'Remote'"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Tiered Ticketing & Settings */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-white/50 border-b border-gray-800 pb-2">
                            <Ticket size={18} />
                            <h2 className="text-xs font-black uppercase tracking-widest">Tiered Pricing (INR)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-2">SILVER PRICE</label>
                                <input
                                    type="number"
                                    {...register("silver", { required: true })}
                                    placeholder="500"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-300 mb-2">GOLD PRICE</label>
                                <input
                                    type="number"
                                    {...register("gold", { required: true })}
                                    placeholder="1500"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono mb-2 text-blue-400/80">DIAMOND PRICE</label>
                                <input
                                    type="number"
                                    {...register("diamond", { required: true })}
                                    placeholder="3000"
                                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-white outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Submit Action */}
                    <div className="pt-8 border-t border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Publish Event
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateEvent;