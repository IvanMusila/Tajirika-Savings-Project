import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="relative z-50 flex justify-between items-center px-6 md:px-10 py-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
            <Link to="/" className="text-lg md:text-xl font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Tajirika
            </Link>
            </div>
            
            <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">
                Sign In
            </Link>
            <Link to="/register" className="bg-white text-[#020817] px-6 py-2.5 rounded-full font-bold transition-all hover:bg-slate-200 text-sm shadow-xl shadow-white/5">
                Register
            </Link>
            </div>
        </nav>

)
};

export default Navbar;

