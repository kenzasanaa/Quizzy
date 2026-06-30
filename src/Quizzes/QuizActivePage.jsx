import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

export default function QuizActivePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null); // ← FIXED: track by index, not text
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load quiz from localStorage
  useEffect(() => {
    const loadQuiz = () => {
      try {
        const saved = localStorage.getItem('quizzesList');
        if (!saved) {
          setQuiz(null);
          setLoading(false);
          return;
        }

        const list = JSON.parse(saved);
        const found = list.find(q => String(q.id) === String(quizId));

        if (!found) {
          setQuiz(null);
          setLoading(false);
          return;
        }

        let playableQuestions = [];
        if (found.questionsArray && Array.isArray(found.questionsArray) && found.questionsArray.length > 0) {
          playableQuestions = found.questionsArray;
        } else if (Array.isArray(found.questions) && found.questions.length > 0 && typeof found.questions[0] === 'object') {
          playableQuestions = found.questions;
        } else {
          const count = typeof found.questions === 'number' ? found.questions : 5;
          playableQuestions = Array.from({ length: Math.min(count, 10) }, (_, i) => ({
            id: i + 1,
            question: `Question ${i + 1}: Please update your quiz with real questions in the Create Quiz page.`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            points: 10,
            difficulty: 'Medium'
          }));
        }

        setQuiz({
          ...found,
          questionsArray: playableQuestions,
          timePerQuestion: 30
        });
        setSecondsLeft(30);

      } catch (err) {
        console.error('Failed to load quiz:', err);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (isFinished || !quiz || showResult || secondsLeft <= 0) {
      if (secondsLeft <= 0 && !isFinished && !showResult) {
        handleAutoAdvance();
      }
      return;
    }
    const timer = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, isFinished, quiz, showResult]);

  const handleAutoAdvance = () => {
    if (showResult || isFinished) return;
    const currentQuestion = quiz.questionsArray[currentIdx];
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: null,
      selectedText: 'No Answer',
      correct: false,
      points: 0
    }]);
    advanceQuestion();
  };

  const advanceQuestion = () => {
    setSelectedIndex(null); // ← FIXED: reset index
    setShowResult(false);
    setSecondsLeft(quiz.timePerQuestion || 30);

    if (currentIdx + 1 < quiz.questionsArray.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleOptionSelect = (index) => { // ← FIXED: accept index
    if (showResult || isFinished) return;
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex === null || showResult || isFinished) return; // ← FIXED: check null

    const currentQuestion = quiz.questionsArray[currentIdx];
    const selectedOptionText = currentQuestion.options[selectedIndex]; // ← FIXED: get text by index
    const isCorrect = selectedOptionText === currentQuestion.correctAnswer;

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: selectedIndex,
      selectedText: selectedOptionText,
      correct: isCorrect,
      points: isCorrect ? (currentQuestion.points || 10) : 0
    }]);

    setShowResult(true);

    setTimeout(() => {
      advanceQuestion();
    }, 1500);
  };

  const handleSkip = () => {
    if (showResult || isFinished) return;
    const currentQuestion = quiz.questionsArray[currentIdx];
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: null,
      selectedText: 'Skipped',
      correct: false,
      points: 0
    }]);
    advanceQuestion();
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIndex(null); // ← FIXED
    setAnswers([]);
    setSecondsLeft(quiz.timePerQuestion || 30);
    setIsFinished(false);
    setShowResult(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1026] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#FF7AB6] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#1B1026] flex items-center justify-center text-white p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Quiz Not Found</h2>
          <p className="text-zinc-400 text-sm mb-6">This quiz doesn't exist or may have been deleted.</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-6 py-2.5 bg-[#FF7AB6] text-[#1B1026] font-bold rounded-xl text-sm hover:opacity-90 transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questionsArray || [];
  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-[#1B1026] flex items-center justify-center text-white p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
          <p className="text-zinc-400 text-sm mb-6">This quiz was created without questions. Please recreate it with the updated Create Quiz page.</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-6 py-2.5 bg-[#FF7AB6] text-[#1B1026] font-bold rounded-xl text-sm hover:opacity-90 transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Results screen
  if (isFinished) {
    const correctCount = answers.filter(a => a.correct).length;
    const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);
    const maxPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <div className="min-h-screen bg-[#1B1026] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-3xl p-8 shadow-2xl text-center">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${percentage >= 70 ? 'text-yellow-400' : percentage >= 40 ? 'text-[#FF7AB6]' : 'text-zinc-400'}`} />
          <h1 className="text-3xl font-black mb-2">Quiz Complete!</h1>
          <p className="text-zinc-400 text-sm mb-8">{quiz.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1B1026] rounded-2xl p-4 border border-[#FF7AB6]/5">
              <p className="text-2xl font-black text-white">{correctCount}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Correct</p>
            </div>
            <div className="bg-[#1B1026] rounded-2xl p-4 border border-[#FF7AB6]/5">
              <p className="text-2xl font-black text-[#FF7AB6]">{percentage}%</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Score</p>
            </div>
            <div className="bg-[#1B1026] rounded-2xl p-4 border border-[#FF7AB6]/5">
              <p className="text-2xl font-black text-white">{totalPoints}/{maxPoints}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Points</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-semibold text-sm hover:border-[#FF7AB6] transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={() => navigate('/quizzes')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] font-bold text-sm hover:opacity-90 transition-all"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1026] text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#1B1026]/95 backdrop-blur border-b border-[#FF7AB6]/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/quizzes')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">
              {currentIdx + 1} / {totalQuestions}
            </span>
            <div className="w-32 h-2 bg-[#2D1B3D] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className={`flex items-center gap-1.5 text-sm font-mono ${secondsLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-[#FF7AB6]'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(secondsLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-[#FF7AB6]/10 text-[#FF7AB6] text-[10px] font-bold uppercase tracking-wider rounded-full">
              {currentQuestion.difficulty || 'Medium'}
            </span>
            <span className="text-xs text-zinc-500">{currentQuestion.points || 10} points</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options — FIXED: use index instead of option text */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedIndex === index; // ← FIXED: compare index
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)} // ← FIXED: pass index
                  disabled={showResult}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    showCorrect
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : showWrong
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : isSelected
                      ? 'border-[#FF7AB6] bg-[#FF7AB6]/10'
                      : 'border-[#2D1B3D] bg-[#1B1026]/50 hover:border-[#FF7AB6]/30'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold shrink-0 ${
                    showCorrect
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : showWrong
                      ? 'bg-rose-500/20 text-rose-400'
                      : isSelected
                      ? 'bg-[#FF7AB6]/20 text-[#FF7AB6]'
                      : 'bg-[#2D1B3D] text-zinc-400'
                  }`}>
                    {showCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                     showWrong ? <XCircle className="w-5 h-5" /> : letter}
                  </span>
                  <span className={`text-sm font-medium ${
                    showCorrect ? 'text-emerald-400' : showWrong ? 'text-rose-400' : 'text-white'
                  }`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            disabled={showResult}
            className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors disabled:opacity-30"
          >
            Skip Question
          </button>

          <button
            onClick={handleNext}
            disabled={selectedIndex === null || showResult} // ← FIXED: check null
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
              selectedIndex !== null && !showResult // ← FIXED
                ? 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-90 shadow-lg shadow-[#FF7AB6]/20'
                : 'bg-[#2D1B3D] text-zinc-500 cursor-not-allowed'
            }`}
          >
            {currentIdx + 1 === totalQuestions ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}