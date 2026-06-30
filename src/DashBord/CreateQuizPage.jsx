import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'teacher';

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizCategory, setQuizCategory] = useState('Science');
  const [quizDuration, setQuizDuration] = useState('20 min');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10,
      difficulty: 'Medium'
    }
  ]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 10,
        difficulty: 'Medium'
      }
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId, optIndex, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const newOptions = [...q.options];
      newOptions[optIndex] = value;
      return { ...q, options: newOptions };
    }));
  };

  const handleSave = () => {
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.correctAnswer.trim())) {
      alert('Please fill in all questions, options, and correct answers');
      return;
    }

    const newQuiz = {
      id: Date.now(),
      title: quizTitle,
      description: quizDescription || 'No description',
      status: 'Published',
      questions: questions.length,
      duration: quizDuration,
      completions: 0,
      category: quizCategory,
      // THIS IS THE KEY: save actual playable questions
      questionsArray: questions.map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        difficulty: q.difficulty
      }))
    };

    const existing = JSON.parse(localStorage.getItem('quizzesList') || '[]');
    localStorage.setItem('quizzesList', JSON.stringify([newQuiz, ...existing]));

    alert('Quiz created successfully!');
    navigate('/quizzes');
  };

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="dashboard" navigate={navigate} />
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 p-6 z-50 transform transition-transform duration-300 lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeTab="dashboard" isMobile onClose={() => setIsMobileSidebarOpen(false)} navigate={navigate} />
      </aside>

      {/* Content */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        <Header userRole={userRole} onMenuClick={() => setIsMobileSidebarOpen(true)} onCreateQuiz={() => {}} />

        <div className="grow p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
          <button onClick={() => navigate('/quizzes')} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Quizzes
          </button>

          <h1 className="text-2xl font-black text-white">Create New Quiz</h1>

          {/* Quiz Info */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Quiz Title</label>
              <input
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                placeholder="e.g. Introduction to Biology"
                className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
                <select
                  value={quizCategory}
                  onChange={e => setQuizCategory(e.target.value)}
                  className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF7AB6]/40"
                >
                  <option>Science</option>
                  <option>Mathematics</option>
                  <option>History</option>
                  <option>Literature</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Duration</label>
                <select
                  value={quizDuration}
                  onChange={e => setQuizDuration(e.target.value)}
                  className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF7AB6]/40"
                >
                  <option>5 min</option>
                  <option>10 min</option>
                  <option>15 min</option>
                  <option>20 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Description</label>
                <input
                  value={quizDescription}
                  onChange={e => setQuizDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Questions ({questions.length})</h2>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF7AB6] uppercase tracking-wider">Question {idx + 1}</span>
                  <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  value={q.question}
                  onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2D1B3D] text-xs font-bold text-zinc-400 shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <input
                        value={opt}
                        onChange={e => updateOption(q.id, optIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        className="flex-1 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Correct Answer</label>
                    <select
                      value={q.correctAnswer}
                      onChange={e => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                      className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF7AB6]/40"
                    >
                      <option value="">Select correct answer</option>
                      {q.options.map((opt, i) => opt && (
                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Points</label>
                    <input
                      type="number"
                      value={q.points}
                      onChange={e => updateQuestion(q.id, 'points', Number(e.target.value))}
                      className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF7AB6]/40"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Difficulty</label>
                    <select
                      value={q.difficulty}
                      onChange={e => updateQuestion(q.id, 'difficulty', e.target.value)}
                      className="w-full bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF7AB6]/40"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="w-full py-3 border border-dashed border-[#FF7AB6]/30 rounded-2xl text-[#FF7AB6] text-sm font-semibold hover:bg-[#FF7AB6]/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] font-bold rounded-2xl text-sm hover:opacity-95 transition-all shadow-lg shadow-[#FF7AB6]/10 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
}