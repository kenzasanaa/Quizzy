import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

// Custom Brand SVGs to keep dependencies clean and robust
const FacebookIcon = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ size = 18, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#120a1a] border-t border-[#FF7AB6]/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        <div className="space-y-6">
          <span className="text-2xl font-black tracking-wider bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">
            Quizzy
          </span>
          <p className="text-zinc-300 text-sm leading-relaxed">
            The ultimate quiz platform for students and teachers. Learn, compete, and earn rewards
          </p>
          <div className="flex items-center gap-4 text-[#FF7AB6]">
            <a href="#" className="hover:text-[#FFD166] transition-colors"><FacebookIcon size={18} /></a>
            <a href="#" className="hover:text-[#FFD166] transition-colors"><TwitterIcon size={18} /></a>
            <a href="#" className="hover:text-[#FFD166] transition-colors"><InstagramIcon size={18} /></a>
            <a href="#" className="hover:text-[#FFD166] transition-colors"><LinkedinIcon size={18} /></a>
            <a href="#" className="hover:text-[#FFD166] transition-colors"><YoutubeIcon size={18} /></a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white text-base">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white text-base">For Teachers</h4>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">About</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Contact us</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Culture</a></li>
            <li><a href="#" className="hover:text-[#FFD166] transition-colors">Blog</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white text-base">Contacts us</h4>
          <ul className="space-y-3.5 text-sm text-zinc-300">
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#FF7AB6]" />
              <span className="hover:text-[#FFD166] transition-colors">contact@quizzy.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#FF7AB6]" />
              <span className="hover:text-[#FFD166] transition-colors">(+7) 687 - 5892</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#FF7AB6] mt-0.5" />
              <span>grajdansky, 28 <br />SaintPetersburg</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#FF7AB6]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>Copyright © 2026 KenzaSanaa</p>
        <div className="flex items-center gap-4">
          <span>All Rights Reserved</span>
          <span className="text-zinc-800">|</span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms and Conditions</a>
          <span className="text-zinc-800">|</span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}