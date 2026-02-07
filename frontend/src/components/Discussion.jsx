// components/DiscussionForum.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';

const DiscussionForum = ({ eventId }) => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [isSynced, setIsSynced] = useState(false);

    // 1. Sync User to DB (Crucial for Foreign Key)
    useEffect(() => {
        const syncUser = async () => {
            if (user) {
                try {
                    await axios.post("http://localhost:5000/api/users/sync", {
                        clerkId: user.id,
                        fullName: user.fullName,
                        email: user.primaryEmailAddress.emailAddress,
                        profileImageUrl: user.imageUrl
                    });
                    setIsSynced(true);
                    fetchPosts(); // Fetch posts only after we know the user is synced
                } catch (err) {
                    console.error("User sync failed", err);
                }
            }
        };
        syncUser();
    }, [user, eventId]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${eventId}/discussions`);
            setPosts(res.data);
        } catch (err) { console.error("Forum fetch error", err); }
    };

    const handlePost = async () => {
        if (!newPost.trim() || !user || !isSynced) return;
        
        try {
            await axios.post('http://localhost:5000/api/engagement', {
                eventId,
                userId: user.id,
                type: 'question',
                content: newPost
            });
            setNewPost("");
            fetchPosts(); 
        } catch (err) {
            console.error("Post failed", err.response?.data);
            alert("Database rejected the message. Check if User Sync worked.");
        }
    };

    return (
        <div className="bg-gray-900/10 border border-gray-800/50 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold flex items-center gap-3 uppercase tracking-tighter text-white">
                    <MessageSquare size={18} className="text-gray-500" /> Discussion_Hub
                </h3>
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    {posts.length} Messages
                </span>
            </div>

            {/* Input Section */}
            {!user ? (
                <div className="flex items-center gap-2 text-yellow-500/50 text-[10px] font-mono mb-10 uppercase italic">
                    <AlertCircle size={14} /> Sign in to join the conversation
                </div>
            ) : (
                <div className="relative mb-10 group">
                    <input 
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={isSynced ? "Contribute to the conversation..." : "Syncing profile..."}
                        disabled={!isSynced}
                        className="w-full bg-black border border-gray-800 p-5 rounded-2xl focus:border-white outline-none text-sm transition-all pr-16 disabled:opacity-50"
                        onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                    />
                    <button 
                        onClick={handlePost}
                        disabled={!isSynced}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all disabled:bg-gray-800"
                    >
                        <Send size={16} />
                    </button>
                </div>
            )}

            {/* Posts Stream */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {posts.length > 0 ? posts.map((post) => (
                    <div key={post.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2">
                        <img 
                            src={post.profileImageUrl || "https://avatar.iran.liara.run/public"} 
                            className="w-10 h-10 rounded-full border border-gray-800 grayscale group-hover:grayscale-0 transition-all" 
                            alt="User" 
                        />
                        <div className="flex-1 bg-gray-900/20 p-4 rounded-2xl border border-gray-800/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase tracking-tight italic text-white">{post.fullName}</span>
                                <span className="text-[9px] font-mono text-gray-600">
                                    {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{post.content}</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-700 font-mono text-[10px] uppercase tracking-widest">
                        No conversations yet. Start one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionForum;