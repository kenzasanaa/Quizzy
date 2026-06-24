import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#1B1026]/85 backdrop-blur-md border-b border-[#FF7AB6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-black tracking-wider bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent outline-none cursor-pointer"
          >
            Quizzy
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#quiz" className="text-zinc-300 hover:text-[#FFB86B] font-medium transition-colors">Quiz</a>
          <a href="#weekly-quiz" className="text-zinc-300 hover:text-[#FFB86B] font-medium transition-colors">Weekly Quiz</a>
          <a href="#rewards" className="text-zinc-300 hover:text-[#FFB86B] font-medium transition-colors">Rewards</a>
          <a href="#about" className="text-zinc-300 hover:text-[#FFB86B] font-medium transition-colors">About</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/signin')}
            className="text-[#FF7AB6] border border-[#FF7AB6]/30 hover:border-[#FF7AB6] font-semibold px-6 py-2.5 rounded-full text-sm transition-colors bg-[#FF7AB6]/5 outline-none"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-[#FFD166] hover:bg-[#FFB86B] text-[#1B1026] font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md shadow-[#FFD166]/10 outline-none"
          >
            Register
          </button>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden text-zinc-300 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1B1026] border-b border-[#FF7AB6]/10 px-4 py-6 space-y-4 absolute w-full left-0 transition-all duration-300 shadow-xl">
          <nav className="flex flex-col gap-4">
            <a href="#quiz" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-[#FFB86B] font-medium">Quiz</a>
            <a href="#weekly-quiz" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-[#FFB86B] font-medium">Weekly Quiz</a>
            <a href="#rewards" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-[#FFB86B] font-medium">Rewards</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-[#FFB86B] font-medium">About</a>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-[#FF7AB6]/10">
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/signin'); }}
              className="w-full text-[#FF7AB6] border border-[#FF7AB6]/30 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#FF7AB6]/5"
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
              className="w-full bg-[#FFD166] text-[#1B1026] px-6 py-2.5 rounded-full text-sm font-bold"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}