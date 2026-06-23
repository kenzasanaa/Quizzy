import React from 'react';
import Navbar from './LandingPage/Navbar';
import Hero from './LandingPage/Hero';
import Categories from './LandingPage/Categories';
import WhyQuizzy from './LandingPage/WhyQuizzy';
import CtaBanner from './LandingPage/CtaBanner';
import Footer from './LandingPage/Footer';


export default function QuizzyLandingPage({ navigateTo }) {
  return (
    <div className="bg-[#1B1026] text-zinc-100 min-h-screen font-sans selection:bg-[#FF7AB6]/30 selection:text-white overflow-x-hidden">
      <Navbar navigateTo={navigateTo} />
      <Hero navigateTo={navigateTo} />
      <Categories />
      <WhyQuizzy />
      <CtaBanner navigateTo={navigateTo} />
      <Footer />
    </div>
  );
}