import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Zap } from "lucide-react";

export default function Navbar() {
    const { user } = useUser();

    return (
        <nav className="flex items-center justify-between px-8 py-5 bg-black border-b border-gray-800 sticky top-0 z-50">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-white p-1 rounded">
                    <Zap size={18} className="text-black fill-black" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:tracking-widest transition-all">
                    Evently
                </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-8 items-center">
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Explore
                </Link>

                {/* Manager-only Link: Visible only when Signed In */}
                <SignedIn>
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <LayoutDashboard size={16} />
                        Manager Dashboard
                    </Link>
                </SignedIn>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-4">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-sm font-bold text-white border border-gray-800 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                        <span className="hidden md:block text-xs font-mono text-gray-500 uppercase">
                            {user?.firstName || "Manager"}
                        </span>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-gray-700 hover:border-white transition-all"
                                }
                            }}
                        />
                    </div>
                </SignedIn>
            </div>
        </nav>
    );
}