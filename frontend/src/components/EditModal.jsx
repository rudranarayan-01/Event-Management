import React from 'react'
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import api from '../../api/api';

const EditModal = ({ event, close, refresh }) => {
    const { register, handleSubmit } = useForm({ defaultValues: event });

    const onUpdate = async (data) => {
        try {
            await api.put(`/events/${event.id}`, data);
            refresh(data);
            close();
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-3xl p-8 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Update_Event</h2>
                    <button onClick={close} className="text-gray-500 hover:text-white"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4 font-mono text-xs">
                    {/* Title Input */}
                    <div>
                        <label className="text-gray-500 mb-1 block">EVENT TITLE</label>
                        <input {...register("title")} className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-white outline-none" />
                    </div>

                    {/* Location Input */}
                    <div>
                        <label className="text-gray-500 mb-1 block">LOCATION</label>
                        <input {...register("location")} className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-white outline-none" />
                    </div>

                    {/* NEW: Date & Time Input */}
                    <div>
                        <label className="text-gray-500 mb-1 block">DATE & TIME</label>
                        <input
                            type="datetime-local"
                            {...register("dateTime")}
                            className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-white outline-none"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="text-gray-500 mb-1 block">DESCRIPTION</label>
                        <textarea {...register("description")} className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-white outline-none" rows="3" />
                    </div>

                    <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-black uppercase mt-4">
                        Commit Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditModal