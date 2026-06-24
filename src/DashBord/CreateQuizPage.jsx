import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Check, Trash2, Plus } from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ВЫНЕСЕНЫ ВНЕ КЛАССА, ЧТОБЫ ИНПУТЫ НЕ ТЕРЯЛИ ФОКУС ПРИ ВВОДЕ ---
const Toggle = ({ active, onToggle }) => (
  <button 
    type="button" 
    onClick={onToggle}
    className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${active ? 'bg-[#FF7AB6]' : 'bg-zinc-800'}`}
  >
    <span className={`w-4 h-4 bg-[#1B1026] rounded-full absolute top-1 left-1 transition-transform duration-200 ${active ? 'translate-x-5 bg-white' : 'translate-x-0 bg-zinc-400'}`} />
  </button>
);

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [createStep, setCreateStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Данные квиза и настройки
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizCategory, setQuizCategory] = useState("Science");
  const [quizDifficulty, setQuizDifficulty] = useState("Medium");
  const [timeLimit, setTimeLimit] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [randomize, setRandomize] = useState(true);
  const [immediateResults, setImmediateResults] = useState(true);

  // Step 2: Полностью динамический массив вопросов (Feature 2)
  const [questionsList, setQuestionsList] = useState([
    {
      id: 1,
      points: 10,
      type: "Multiple Choice",
      text: "",
      answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswerIdx: 2
    }
  ]);

  // Валидация Шага 1 (Title, Description)
  const validateStep1 = () => {
    setErrorMsg("");

    if (!quizTitle.trim()) {
      setErrorMsg("Please enter a quiz title.");
      return false;
    }
    if (!quizDesc.trim()) {
      setErrorMsg("Please enter a quiz description.");
      return false;
    }

    return true;
  };

  // Валидация Шага 2 (Questions & Answer options)
  const validateStep2 = () => {
    setErrorMsg("");

    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      if (!q.text.trim()) {
        setErrorMsg(`Please write the question text for Question ${i + 1}.`);
        return false;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].trim()) {
          setErrorMsg(`Option ${j + 1} of Question ${i + 1} cannot be empty.`);
          return false;
        }
      }
    }

    return true;
  };

  // Переход на следующий шаг с валидацией
  const handleNextStep = () => {
    if (validateStep1()) {
      setCreateStep(2);
    }
  };

  // Добавление нового пустого вопроса
  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now() + Math.random(),
      points: 10,
      type: "Multiple Choice",
      text: "",
      answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswerIdx: 0
    };
    setErrorMsg("");
    setQuestionsList([...questionsList, newQ]);
  };

  // Удаление вопроса
  const handleDeleteQuestion = (qId) => {
    if (questionsList.length > 1) {
      setErrorMsg("");
      setQuestionsList(questionsList.filter(q => q.id !== qId));
    }
  };

  // Универсальный апдейтер полей вопроса
  const handleUpdateQuestion = (qId, field, value) => {
    setErrorMsg("");
    setQuestionsList(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  // Публикация квиза и авто-создание ивента в localStorage (Feature 1)
  const handlePublishQuiz = () => {
    // Двойная проверка на всякий случай
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    // А. Сохраняем в квизы
    const savedQuizzes = JSON.parse(localStorage.getItem('quizzesList') || '[]');
    const newQuizObj = {
      id: Date.now(),
      title: quizTitle || "Untitled Quiz",
      questions: questionsList.length,
      completions: 0,
      rate: 100
    };
    localStorage.setItem('quizzesList', JSON.stringify([...savedQuizzes, newQuizObj]));

    // Б. Автоматически создаем соответствующий ивент в списке событий!
    const savedEvents = JSON.parse(localStorage.getItem('eventsList') || '[]');
    const newEventObj = {
      id: Date.now() + 1,
      title: quizTitle || "Untitled Quiz Event",
      time: "Unscheduled",
      participants: '0 participants',
      isLive: false,
      date: "",
      description: quizDesc || "No description provided."
    };
    localStorage.setItem('eventsList', JSON.stringify([...savedEvents, newEventObj]));

    // Возвращаемся на дашборд
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex flex-col p-4 sm:p-8">
      <div className="w-full max-w-5xl mx-auto bg-[#120a1a] border border-[#FF7AB6]/10 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-800/60 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all outline-none cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-none">Create New Quiz</h2>
              <p className="text-zinc-500 text-xs">Add questions, set answers and configure quiz settings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all outline-none"
            >
              Save Draft
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#FF7AB6] hover:bg-[#FF7AB6]/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all outline-none"
            >
              Preview
            </button>
          </div>
        </div>

        {/* Step 1 Content */}
        {createStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-[#251836]/40 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">Quiz Details</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Basic information about your quiz</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 block">Quiz Title</label>
                  <input 
                    type="text"
                    value={quizTitle}
                    placeholder="Write your quiz title"
                    onChange={(e) => {
                      setErrorMsg("");
                      setQuizTitle(e.target.value);
                    }}
                    className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 block">Description</label>
                  <textarea 
                    rows={4}
                    value={quizDesc}
                    placeholder="Write your quiz description"
                    onChange={(e) => {
                      setErrorMsg("");
                      setQuizDesc(e.target.value);
                    }}
                    className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 block">Category</label>
                    <select 
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                      className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-zinc-300"
                    >
                      <option value="Science">Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 block">Difficulty Level</label>
                    <select 
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value)}
                      className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-zinc-300"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel Settings */}
            <div className="lg:col-span-2 bg-[#251836]/40 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white">Quiz Settings</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Configure how your quiz works</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 block">Time Limit</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-16 outline-none transition-all text-sm text-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">minutes</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 block">Passing Score</label>
                    <div className="relative">
                      <Check size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="number"
                        value={passingScore}
                        onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#1B1026]/90 border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-8 outline-none transition-all text-sm text-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/30">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white">Randomize Questions</h4>
                      <p className="text-[10px] text-zinc-500">Show questions in random order</p>
                    </div>
                    <Toggle active={randomize} onToggle={() => setRandomize(!randomize)} />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/30">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white">Immediate Results</h4>
                      <p className="text-[10px] text-zinc-500">Show results for each question</p>
                    </div>
                    <Toggle active={immediateResults} onToggle={() => setImmediateResults(!immediateResults)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Content */}
        {createStep === 2 && (
          <div className="w-full bg-[#251836]/40 border border-zinc-800/50 rounded-2xl p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-black text-white">Quiz Questions</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Create and manage your quiz questions</p>
            </div>

            <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
              {questionsList.map((q, qIdx) => (
                <div key={q.id} className="bg-[#1B1026]/90 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  
                  {/* Question header bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h4 className="font-black text-base text-white">Question {qIdx + 1}</h4>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-400">Points:</span>
                        <input 
                          type="number" 
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(q.id, 'points', parseInt(e.target.value) || 0)}
                          className="w-16 bg-[#251836] border border-zinc-800 rounded-xl py-2 px-3 text-center text-sm font-bold text-white outline-none focus:border-[#FF7AB6]" 
                        />
                      </div>

                      <select 
                        value={q.type}
                        onChange={(e) => handleUpdateQuestion(q.id, 'type', e.target.value)}
                        className="bg-[#251836] border border-zinc-800 rounded-xl py-2 px-4 text-xs font-bold text-zinc-300 outline-none"
                      >
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="True/False">True / False</option>
                      </select>

                      <button 
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        disabled={questionsList.length === 1}
                        className="text-rose-400 hover:text-rose-300 p-2 hover:bg-rose-500/5 rounded-lg transition-colors outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Question text box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Question Text</label>
                    <textarea 
                      rows={3}
                      value={q.text}
                      onChange={(e) => handleUpdateQuestion(q.id, 'text', e.target.value)}
                      placeholder="Enter question text here..."
                      className="w-full bg-[#251836] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white resize-none"
                    />
                  </div>

                  {/* Answer Options list */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 block">Answer Options</label>
                    <div className="space-y-2.5">
                      {q.answers.map((ans, ansIdx) => {
                        const isCorrect = q.correctAnswerIdx === ansIdx;
                        return (
                          <div 
                            key={ansIdx}
                            onClick={() => handleUpdateQuestion(q.id, 'correctAnswerIdx', ansIdx)}
                            className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                              isCorrect 
                                ? 'border-[#FF7AB6] bg-[#FF7AB6]/5 shadow-sm shadow-[#FF7AB6]/10' 
                                : 'border-zinc-800 hover:border-zinc-700 bg-[#251836]'
                            }`}
                          >
                            {/* Checkbox / Radio Circle */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isCorrect ? 'border-[#FF7AB6]' : 'border-zinc-600'
                            }`}>
                              {isCorrect && <div className="w-2.5 h-2.5 bg-[#FF7AB6] rounded-full" />}
                            </div>

                            {/* Dynamically editable text input field */}
                            <input 
                              type="text" 
                              value={ans}
                              placeholder={`Option ${ansIdx + 1}`}
                              onClick={(e) => e.stopPropagation()} 
                              onChange={(e) => {
                                const updatedAnswers = [...q.answers];
                                updatedAnswers[ansIdx] = e.target.value;
                                handleUpdateQuestion(q.id, 'answers', updatedAnswers);
                              }}
                              className="bg-transparent border-none text-sm text-zinc-200 outline-none w-full p-0 focus:text-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={handleAddQuestion}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-[#FF7AB6]/30 py-4 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-all outline-none group cursor-pointer"
            >
              <Plus size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Add Question</span>
            </button>
          </div>
        )}

        {/* Validation Error Banner */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-semibold text-center mt-6 max-w-lg mx-auto">
            {errorMsg}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-800/60">
          <button 
            onClick={() => {
              setErrorMsg("");
              setCreateStep(1);
            }}
            disabled={createStep === 1}
            className="border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            Prev
          </button>

          {createStep === 1 ? (
            <button 
              onClick={handleNextStep}
              className="bg-[#FF7AB6] hover:bg-[#FF7AB6]/90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#FF7AB6]/10 outline-none flex items-center gap-2 cursor-pointer"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handlePublishQuiz}
              className="bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] text-[#1B1026] font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#FF7AB6]/10 outline-none cursor-pointer"
            >
              Preview & Publish
            </button>
          )}
        </div>

      </div>
    </div>
  );
}