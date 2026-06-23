import React from 'react';

export default function CtaBanner({ navigateTo }) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* High impact gradient box utilizing the entire palette */}
      <div className="bg-linear-to-br from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-[#FF7AB6]/10 relative overflow-hidden">
        
        {/* Soft background light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-xl space-y-6 text-center lg:text-left relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1B1026] leading-tight">
            Ready to Start Your Quiz Journey?
          </h2>
          <p className="text-[#1B1026] text-sm sm:text-base font-medium opacity-90 leading-relaxed">
            Join thousands of students and teachers. Sign up today and get access to all features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigateTo('register')}
              className="w-full sm:w-auto bg-[#1B1026] text-white hover:bg-[#251836] font-bold px-8 py-3.5 rounded-full shadow-lg transition-all"
            >
              Create Account
            </button>
            <button className="w-full sm:w-auto border border-[#1B1026]/30 text-[#1B1026] hover:bg-[#1B1026]/10 font-bold px-8 py-3.5 rounded-full transition-colors">
              Explore Quizzes
            </button>
          </div>
        </div>

        {/* Branding card container inverted with dark plum background to accent logo gradient */}
        <div className="relative z-10 shrink-0 w-full sm:w-[320px] lg:w-96">
          <div className="bg-[#1B1026] rounded-2xl p-10 flex items-center justify-center shadow-2xl aspect-[1.6/1]">
            <span className="text-4xl sm:text-5xl font-black tracking-widest bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">
              Quizzy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}