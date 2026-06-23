import React from 'react';
import { Atom, Calculator, Beaker, Dna, Globe, FileText, ArrowRight } from 'lucide-react';

const categories = [
  {
    title: "Science & Tech",
    desc: "Test your knowledge in science & tech with our challenging quizzes",
    icon: Atom,
    borderColor: "group-hover:border-[#FF7AB6]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,122,182,0.15)]",
    iconBg: "bg-[#FF7AB6]/10 text-[#FF7AB6] border-[#FF7AB6]/20",
    linkText: "text-[#FF7AB6] group-hover:text-white"
  },
  {
    title: "Mathematics",
    desc: "Test your knowledge in mathematics with our challenging quizzes",
    icon: Calculator,
    borderColor: "group-hover:border-[#FFB86B]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,184,107,0.15)]",
    iconBg: "bg-[#FFB86B]/10 text-[#FFB86B] border-[#FFB86B]/20",
    linkText: "text-[#FFB86B] group-hover:text-white"
  },
  {
    title: "Chemistry",
    desc: "Test your knowledge in chemistry with our challenging quizzes",
    icon: Beaker,
    borderColor: "group-hover:border-[#FFD166]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,209,102,0.15)]",
    iconBg: "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/20",
    linkText: "text-[#FFD166] group-hover:text-white"
  },
  {
    title: "Biology",
    desc: "Test your knowledge in biology with our challenging quizzes",
    icon: Dna,
    borderColor: "group-hover:border-[#FF7AB6]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,122,182,0.15)]",
    iconBg: "bg-[#FF7AB6]/10 text-[#FF7AB6] border-[#FF7AB6]/20",
    linkText: "text-[#FF7AB6] group-hover:text-white"
  },
  {
    title: "General Knowledge",
    desc: "Test your knowledge in general knowledge with our challenging quizzes",
    icon: Globe,
    borderColor: "group-hover:border-[#FFB86B]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,184,107,0.15)]",
    iconBg: "bg-[#FFB86B]/10 text-[#FFB86B] border-[#FFB86B]/20",
    linkText: "text-[#FFB86B] group-hover:text-white"
  },
  {
    title: "Current Affairs",
    desc: "Test your knowledge in current affairs with our challenging quizzes",
    icon: FileText,
    borderColor: "group-hover:border-[#FFD166]/60",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(255,209,102,0.15)]",
    iconBg: "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/20",
    linkText: "text-[#FFD166] group-hover:text-white"
  }
];

export default function Categories() {
  return (
    <section id="quiz" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#FF7AB6]/10">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-1 bg-[#251836] border border-[#FF7AB6]/30 px-4 py-1 rounded-full text-xs font-semibold text-[#FFB86B]">
          📁 Categories
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Explore <span className="bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">Quiz Categories</span>
        </h2>
        <p className="max-w-xl mx-auto text-[#d4c5e2] text-sm sm:text-base">
          Discover quizzes across various subjects to test and expand your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <div 
              key={idx}
              className={`group relative bg-[#251836] border border-transparent rounded-2xl p-6 sm:p-8 flex items-start gap-5 transition-all duration-300 ${cat.borderColor} ${cat.glowColor}`}
            >
              <div className={`p-4 rounded-xl border shrink-0 ${cat.iconBg} transition-all`}>
                <IconComponent size={24} />
              </div>

              <div className="space-y-2 grow">
                <h3 className="text-xl font-bold text-white tracking-wide">{cat.title}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{cat.desc}</p>
                <button className={`inline-flex items-center gap-1.5 text-sm font-semibold pt-2 ${cat.linkText} transition-all`}>
                  Explore Quizzes <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}