import React from 'react';
import { BookOpen, Award, GraduationCap, TrendingUp, Trophy, Smartphone } from 'lucide-react';

const features = [
  {
    title: "Personalized Learning",
    desc: "Adaptive quizzes that adjust to your knowledge level and learning pace",
    icon: BookOpen,
    iconColor: "text-[#FF7AB6]"
  },
  {
    title: "Reward System",
    desc: "Earn points, badges, and real rewards for your achievements",
    icon: Award,
    iconColor: "text-[#FFB86B]"
  },
  {
    title: "Teacher Dashboard",
    desc: "Comprehensive tools for educators to create and manage quizzes",
    icon: GraduationCap,
    iconColor: "text-[#FFD166]"
  },
  {
    title: "Progress Tracking",
    desc: "Adaptive quizzes that adjust to your knowledge level and learning pace",
    icon: TrendingUp,
    iconColor: "text-[#FF7AB6]"
  },
  {
    title: "Competitive Leaderboards",
    desc: "Compete with peers and climb the ranks in various categories",
    icon: Trophy,
    iconColor: "text-[#FFB86B]"
  },
  {
    title: "Mobile Friendly",
    desc: "Access quizzes anytime, anywhere on any device",
    icon: Smartphone,
    iconColor: "text-[#FFD166]"
  }
];

export default function WhyQuizzy() {
  return (
    <section id="weekly-quiz" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#FF7AB6]/10">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-1 bg-[#251836] border border-[#FF7AB6]/30 px-4 py-1 rounded-full text-xs font-semibold text-[#FFB86B]">
          ⭐ Features
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Why <span className="bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">Quizzy</span>
        </h2>
        <p className="max-w-xl mx-auto text-[#d4c5e2] text-sm sm:text-base">
          Discover quizzes across various subjects to test and expand your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <div 
              key={idx}
              className="bg-[#251836] border border-[#FF7AB6]/10 rounded-2xl p-6 sm:p-8 space-y-4 transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="p-3 bg-[#1B1026]/40 w-max rounded-xl border border-[#FF7AB6]/10">
                <IconComponent className={feat.iconColor} size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{feat.title}</h3>
                <p className="text-[#d4c5e2] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}