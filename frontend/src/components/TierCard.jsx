import React from 'react'
import {  CheckCircle2 } from 'lucide-react';


const TierCard = ({ type, price, active, onClick, perks }) => 
    (
    <div
        onClick={onClick}
        className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${active ? 'bg-white border-white' : 'bg-black/50 border-gray-800 hover:border-gray-500'
            }`}
    >
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                {active && <CheckCircle2 size={16} className="text-black" />}
                <span className={`text-xs font-black uppercase tracking-widest ${active ? 'text-black' : 'text-white'}`}>
                    {type} Pass
                </span>
            </div>
            <span className={`font-mono font-bold ${active ? 'text-black' : 'text-white'}`}>₹{price}</span>
        </div>

        {active && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                {perks.map(p => (
                    <p key={p} className="text-[10px] text-black/60 font-bold uppercase tracking-tighter">+ {p}</p>
                ))}
            </div>
        )}
    </div>
);

export default TierCard