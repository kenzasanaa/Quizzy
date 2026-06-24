import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Presentation, ArrowLeft } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.58c-.28 1.48-1.11 2.74-2.36 3.58v2.98h3.8c2.22-2.05 3.5-5.07 3.5-8.41z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.8-2.98c-1.06.72-2.42 1.16-4.13 1.16-3.18 0-5.87-2.15-6.83-5.05H1.21v3.09C3.18 21.88 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.17 14.22c-.25-.72-.39-1.5-.39-2.3a7.86 7.86 0 0 1 .39-2.3V6.53H1.21A11.97 11.97 0 0 0 0 12c0 2.12.55 4.12 1.21 5.47l3.96-3.25z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.22 0 12 0 7.31 0 3.18 2.12 1.21 5.47l3.96 3.09c.96-2.9 3.65-5.05 6.83-5.05z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="mr-2 h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex flex-col lg:flex-row font-sans">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B1026] relative flex-col items-center justify-center p-8 overflow-hidden border-r border-[#FF7AB6]/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF7AB6]/10 blur-[130px] rounded-full" style={{ width: '600px', height: '300px' }} />
          <div 
            className="absolute bottom-0 left-0 right-0 opacity-20"
            style={{
              height: '400px',
              backgroundImage: `
                linear-gradient(to top, rgba(255, 122, 182, 0.15) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 184, 107, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(400px) rotateX(60deg) translateY(50px) scale(1.6)',
              transformOrigin: 'bottom center',
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1B1026] via-transparent to-[#1B1026]" />
        </div>
        <div className="relative z-10 text-center">
          <span className="text-6xl font-black tracking-widest bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">
            Quizzy
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-white text-[#1B1026] flex flex-col justify-center p-6 sm:p-12 lg:p-16 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-[#FF7AB6] transition-colors outline-none"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="max-w-md w-full mx-auto space-y-8 pt-8 lg:pt-0">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-[#1B1026]">Create Account</h2>
            <p className="text-zinc-500 text-sm">Choose your account type and start your journey with us</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRole('student')}
              className={`p-4 rounded-xl border text-left flex flex-col gap-2.5 transition-all outline-none ${
                role === 'student' 
                  ? 'border-[#FF7AB6] bg-[#FF7AB6]/5 shadow-sm shadow-[#FF7AB6]/10' 
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className={`p-2 rounded-lg w-max ${role === 'student' ? 'bg-[#FF7AB6]/15 text-[#FF7AB6]' : 'bg-zinc-100 text-zinc-500'}`}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B1026]">Student</h4>
                <p className="text-[11px] text-zinc-500 leading-tight">Take quizzes and track your progress</p>
              </div>
            </button>

            <button 
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-xl border text-left flex flex-col gap-2.5 transition-all outline-none ${
                role === 'teacher' 
                  ? 'border-[#FFB86B] bg-[#FFB86B]/5 shadow-sm shadow-[#FFB86B]/10' 
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className={`p-2 rounded-lg w-max ${role === 'teacher' ? 'bg-[#FFB86B]/15 text-[#FFB86B]' : 'bg-zinc-100 text-zinc-500'}`}>
                <Presentation size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B1026]">Teacher</h4>
                <p className="text-[11px] text-zinc-500 leading-tight">Create quizzes and manage students</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center border border-zinc-200 hover:bg-zinc-50 py-3 rounded-xl text-sm font-semibold transition-colors outline-none">
              <GoogleIcon /> Google
            </button>
            <button className="flex items-center justify-center border border-zinc-200 hover:bg-zinc-50 py-3 rounded-xl text-sm font-semibold transition-colors outline-none">
              <FacebookIcon /> Facebook
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-200 w-full absolute" />
            <span className="bg-white px-4 relative z-10 text-xs font-bold text-zinc-400 tracking-wider">OR</span>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-zinc-50 text-sm border border-zinc-200 hover:border-zinc-300 focus:border-[#FF7AB6] focus:bg-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-[#1B1026]" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="johndoe123" 
                    className="w-full bg-zinc-50 text-sm border border-zinc-200 hover:border-zinc-300 focus:border-[#FF7AB6] focus:bg-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-[#1B1026]" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-zinc-50 text-sm border border-zinc-200 hover:border-zinc-300 focus:border-[#FF7AB6] focus:bg-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-[#1B1026]" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-zinc-50 text-sm border border-zinc-200 hover:border-zinc-300 focus:border-[#FF7AB6] focus:bg-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-[#1B1026]" 
                />
              </div>
            </div>

            <button 
              type="submit"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] text-[#1B1026] font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-md shadow-[#FF7AB6]/10 mt-6 outline-none"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/signin')} 
              className="text-[#FF7AB6] hover:text-[#FFB86B] font-bold transition-colors underline decoration-[#FF7AB6]/30 underline-offset-4 outline-none"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}