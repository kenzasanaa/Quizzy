import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Flag, ArrowRight, Heart, Trophy, RotateCcw, Home } from 'lucide-react';
import { quizQuestionsData } from './quizQuestionsData';

export default function QuizActivePage() {
  const { id } = useParams(); // Dynamic Quiz ID
  const navigate = useNavigate();

  // Load specific quiz or fall back to Quiz 1
  const quizId = id && quizQuestionsData[id] ? id : "1";
  const activeQuiz = quizQuestionsData[quizId];
  const questions = activeQuiz.questions;

  // Active Game State Variables
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Countdown timer per question
  const [secondsLeft, setSecondsLeft] = useState(30);

  const currentQuestion = questions[currentIdx];

  // Timer loop logic
  useEffect(() => {
    if (isGameOver || isQuizComplete) return;

    if (secondsLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isGameOver, isQuizComplete]);

  // Reset timer on moving to next question
  useEffect(() => {
    setSecondsLeft(30);
    setSelectedOption(null);
  }, [currentIdx]);

  // Handle choice selection
  const handleSelectOption = (option) => {
    if (isGameOver || isQuizComplete) return;
    setSelectedOption(option);
  };

  // Skip question action
  const handleSkip = () => {
    advanceQuestion(false, true);
  };

  // Evaluate timeout as an incorrect answer
  const handleTimeOut = () => {
    advanceQuestion(false, false);
  };

  // Proceed to next step
  const handleNext = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    advanceQuestion(isCorrect, false);
  };

  const advanceQuestion = (isCorrect, isSkipped = false) => {
    if (!isSkipped) {
      if (isCorrect) {
        setScore((prev) => prev + currentQuestion.points);
      } else {
        const remainingLives = lives - 1;
        setLives(remainingLives);
        if (remainingLives <= 0) {
          setIsGameOver(true);
          return;
        }
      }
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  // Reset game state
  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setLives(3);
    setSecondsLeft(30);
    setIsGameOver(false);
    setIsQuizComplete(false);
  };

  // Format countdown string
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progressPercent = Math.round(((currentIdx) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex flex-col font-sans overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="h-20 border-b border-[#FF7AB6]/10 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 bg-[#120a1a]/80 backdrop-blur-md sticky top-0 z-40">
        <button 
          onClick={() => navigate('/quizzes')}
          className="p-2.5 bg-[#251836]/40 border border-zinc-800/80 hover:border-[#FF7AB6]/30 rounded-xl text-zinc-400 hover:text-white transition-all outline-none cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-black text-sm sm:text-lg text-white tracking-wide">
          {activeQuiz.title}
        </span>
        <div className="w-10 h-10" /> {/* Spacer for symmetry */}
      </header>

      {/* GAME SCREEN BODY */}
      <main className="grow flex items-center justify-center p-4 sm:p-8">
        
        {/* End Game or Finish Screen */}
        {isGameOver || isQuizComplete ? (
          <div className="w-full max-w-md bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7AB6] to-[#FFB86B] p-0.5 flex items-center justify-center">
              <Trophy className="text-[#1B1026] h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">
                {isQuizComplete ? "Quiz Completed!" : "Game Over!"}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">
                {isQuizComplete 
                  ? "Great job finishing the challenge!" 
                  : "You ran out of lives. Better luck next time!"}
              </p>
            </div>

            <div className="bg-[#1B1026]/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold">Total Score</span>
                <span className="text-[#FFB86B] font-black">{score} pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold">Lives Remaining</span>
                <span className="text-rose-400 font-black">
                  {lives === 0 ? "0 / 3" : `${lives} / 3`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold">Progress</span>
                <span className="text-[#FF7AB6] font-black">
                  {currentIdx + 1} / {questions.length}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleRestart}
                className="grow flex items-center justify-center gap-2 py-3 bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] font-bold rounded-xl text-sm transition-all outline-none cursor-pointer"
              >
                <RotateCcw size={16} /> Replay
              </button>
              <button 
                onClick={() => navigate('/quizzes')}
                className="grow flex items-center justify-center gap-2 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-sm transition-all outline-none cursor-pointer"
              >
                <Home size={16} /> Dashboard
              </button>
            </div>
          </div>
        ) : (
          
          /* Live Active Quiz Grid Layout */
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Main Quiz Panel */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Question Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-400">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Central Question Display Card */}
              <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <span className="px-3 py-1 bg-[#FF7AB6]/10 text-[#FF7AB6] rounded-lg text-xs font-bold border border-[#FF7AB6]/20">
                    {currentQuestion.points} points
                  </span>
                  
                  {/* Countdown Timer */}
                  <div className="flex items-center gap-1.5 text-rose-400 text-sm font-black">
                    <ClockIcon className="animate-pulse" />
                    <span>{formatTime(secondsLeft)}</span>
                  </div>

                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-bold capitalize">
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = selectedOption === option;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(option)}
                      className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all outline-none cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FF7AB6]/10 border-[#FF7AB6] text-white shadow-md shadow-[#FF7AB6]/5' 
                          : 'bg-[#251836]/40 border-zinc-800/60 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-[#FF7AB6] text-[#1B1026]' 
                          : 'bg-[#170E2A] text-zinc-400'
                      }`}>
                        {letter}
                      </span>
                      <span className="font-bold text-sm sm:text-base">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handleSkip}
                  className="px-5 py-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all outline-none cursor-pointer"
                >
                  <Flag size={14} /> Skip
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all outline-none ${
                    selectedOption 
                      ? 'bg-[#FF7AB6] text-[#1B1026] hover:opacity-95 shadow-md shadow-[#FF7AB6]/10 cursor-pointer' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Next Question <ArrowRight size={14} />
                </button>
              </div>

            </div>

            {/* Right Sidebar Stats Panel */}
            <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-28">
              <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 space-y-5 shadow-xl">
                <h3 className="text-sm font-black text-white uppercase tracking-wider text-zinc-400">Quiz Stats</h3>
                
                <div className="space-y-3">
                  {/* Current Score */}
                  <div className="bg-[#170E2A]/60 border border-zinc-800/40 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Score</span>
                    <span className="text-xl font-black text-[#FFB86B] block leading-none">{score}</span>
                  </div>

                  {/* Remaining Lives */}
                  <div className="bg-[#170E2A]/60 border border-zinc-800/40 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Lives</span>
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3].map((heartIdx) => (
                        <Heart 
                          key={heartIdx} 
                          size={16} 
                          className={heartIdx <= lives ? "fill-rose-500 text-rose-500" : "text-zinc-700"} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Current Progress ratio */}
                  <div className="bg-[#170E2A]/60 border border-zinc-800/40 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Progress</span>
                    <span className="text-xl font-black text-zinc-300 block leading-none">{currentIdx + 1}/{questions.length}</span>
                  </div>

                  {/* Current Position placeholder */}
                  <div className="bg-[#170E2A]/60 border border-zinc-800/40 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Position</span>
                    <span className="text-xl font-black text-[#FF7AB6] block leading-none">2nd</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// Inner Timer clock graphic
function ClockIcon({ className }) {
  return (
    <svg 
      className={`w-4 h-4 ${className}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}