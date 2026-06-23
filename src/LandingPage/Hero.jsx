import React from 'react';

export default function Hero({ navigateTo }) {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 overflow-hidden border-b border-[#FF7AB6]/10">
      
      {/* Background Ambience & Perspective Grid lines in Sunset Pastel Tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF7AB6]/10 blur-[130px] rounded-full" 
          style={{ width: '800px', height: '400px' }}
        />
        <div 
          className="absolute top-1/3 left-1/3 bg-[#FFB86B]/10 blur-[110px] rounded-full" 
          style={{ width: '300px', height: '300px' }}
        />
        
        {/* Custom Grid */}
        <div 
          className="absolute bottom-0 left-0 right-0 opacity-20"
          style={{
            height: '400px',
            backgroundImage: `
              linear-gradient(to top, rgba(255, 122, 182, 0.15) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 184, 107, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '45px 45px',
            transform: 'perspective(400px) rotateX(60deg) translateY(50px) scale(1.6)',
            transformOrigin: 'bottom center',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1B1026] via-transparent to-[#1B1026]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 px-4">
        <div className="inline-flex items-center gap-2 bg-[#251836] border border-[#FF7AB6]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-[#FFB86B] shadow-inner">
          <span className="text-[#FF7AB6]">🏆</span> The ultimate quiz experience
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
          Learn, Quiz, <span className="bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">Earn Rewards</span>
        </h1>

        <p className="max-w-2xl mx-auto text-[#d4c5e2] text-base sm:text-lg lg:text-xl leading-relaxed">
          Join thousands of students and teachers on the ultimate quiz platform. 
          Test your knowledge, compete with peers, and win exciting rewards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto bg-[#FFD166] hover:bg-[#FFB86B] text-[#1B1026] font-bold px-8 py-4 rounded-full text-base transition-colors shadow-lg shadow-[#FFD166]/10"
          >
            Get Started
          </button>
          <button className="w-full sm:w-auto border border-[#FF7AB6]/50 text-white hover:bg-[#FF7AB6]/10 font-semibold px-8 py-4 rounded-full text-base transition-all">
            Explore Quizzes
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-8">
          <div className="flex -space-x-3">
            <img 
              className="inline-block h-9 w-9 rounded-full ring-2 ring-[#1B1026] object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
              alt="User" 
            />
            <img 
              className="inline-block h-9 w-9 rounded-full ring-2 ring-[#1B1026] object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" 
              alt="User" 
            />
            <img 
              className="inline-block h-9 w-9 rounded-full ring-2 ring-[#1B1026] object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" 
              alt="User" 
            />
            <img 
              className="inline-block h-9 w-9 rounded-full ring-2 ring-[#1B1026] object-cover" 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" 
              alt="User" 
            />
          </div>
          <p className="text-sm font-medium text-zinc-300">
            <span className="text-[#FF7AB6] font-bold">5,000+</span> students joined this week
          </p>
        </div>
      </div>
    </section>
  );
}