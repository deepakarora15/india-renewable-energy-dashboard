import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store';

interface Question {
  q: string;
  options: string[];
  correct: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const QUESTIONS: Question[] = [
  { q: "India's total solar installed capacity (FY25)?", options: ["50 GW", "70 GW", "90.6 GW", "120 GW"], correct: 2, difficulty: "Easy" },
  { q: "India's total wind installed capacity (FY25)?", options: ["30 GW", "47.7 GW", "60 GW", "80 GW"], correct: 1, difficulty: "Easy" },
  { q: "Record low solar tariff in India?", options: ["₹2.44/kWh", "₹1.99/kWh", "₹3.0/kWh", "₹2.5/kWh"], correct: 1, difficulty: "Easy" },
  { q: "Largest solar park in India?", options: ["Pavagada", "Bhadla", "Rewa", "Charanka"], correct: 1, difficulty: "Easy" },
  { q: "Bhadla Solar Park capacity?", options: ["1,500 MW", "2,245 MW", "3,000 MW", "1,800 MW"], correct: 1, difficulty: "Medium" },
  { q: "Solar CUF in India (average)?", options: ["12%", "15%", "18.2%", "25%"], correct: 2, difficulty: "Medium" },
  { q: "Wind CUF in India (average)?", options: ["15%", "18%", "21.5%", "28%"], correct: 2, difficulty: "Medium" },
  { q: "Largest RE company in India by capacity?", options: ["ReNew", "Tata Power", "Adani Green", "NTPC RE"], correct: 2, difficulty: "Easy" },
  { q: "India's solar target for 2030?", options: ["100 GW", "200 GW", "280 GW", "350 GW"], correct: 2, difficulty: "Easy" },
  { q: "Offshore wind target for 2030?", options: ["10 GW", "20 GW", "30 GW", "50 GW"], correct: 2, difficulty: "Medium" },
  { q: "Which state leads in wind capacity?", options: ["Gujarat", "Rajasthan", "Tamil Nadu", "Maharashtra"], correct: 2, difficulty: "Easy" },
  { q: "Dominant solar technology in India?", options: ["Thin Film", "HJT", "Mono-PERC", "TOPCon"], correct: 2, difficulty: "Medium" },
  { q: "Wind turbine hub height trend (2025)?", options: ["80m", "100m", "120m", "160m"], correct: 3, difficulty: "Hard" },
  { q: "Cyclone Tauktae wind claim amount?", options: ["₹50 Cr", "₹100 Cr", "₹180 Cr", "₹250 Cr"], correct: 2, difficulty: "Hard" },
  { q: "Solar tariff in 2010?", options: ["₹8/kWh", "₹12/kWh", "₹17/kWh", "₹20/kWh"], correct: 2, difficulty: "Medium" },
  { q: "What % of solar is utility-scale?", options: ["50%", "65%", "75%", "85%"], correct: 2, difficulty: "Medium" },
  { q: "Adani Green total RE capacity?", options: ["10,000 MW", "15,000 MW", "20,000 MW", "25,000 MW"], correct: 2, difficulty: "Easy" },
  { q: "Solar private ownership share?", options: ["60%", "70%", "79%", "90%"], correct: 2, difficulty: "Medium" },
  { q: "Wind private ownership share?", options: ["75%", "85%", "91%", "95%"], correct: 2, difficulty: "Hard" },
  { q: "Repowering opportunity in wind?", options: ["5 GW", "10 GW", "15 GW", "20 GW"], correct: 1, difficulty: "Medium" },
  { q: "First offshore wind tender location?", options: ["Tamil Nadu", "Gujarat", "Maharashtra", "Odisha"], correct: 1, difficulty: "Medium" },
  { q: "Solar generation FY25?", options: ["100 BU", "120 BU", "140.4 BU", "160 BU"], correct: 2, difficulty: "Easy" },
  { q: "Wind generation FY25?", options: ["60 BU", "75 BU", "87.9 BU", "100 BU"], correct: 2, difficulty: "Easy" },
  { q: "Peak wind generation months?", options: ["Jan-Mar", "Apr-May", "Jun-Sep", "Oct-Dec"], correct: 2, difficulty: "Easy" },
  { q: "PLI scheme is for?", options: ["Tariff subsidy", "Manufacturing", "Land allocation", "Grid connection"], correct: 1, difficulty: "Medium" },
  { q: "Largest wind EMV risk?", options: ["Lightning", "Cyclone", "Gearbox", "Tower fatigue"], correct: 1, difficulty: "Hard" },
  { q: "BESS stands for?", options: ["Basic Energy Storage", "Battery Energy Storage System", "Bilateral Electric Supply", "Base Energy Solar System"], correct: 1, difficulty: "Easy" },
  { q: "Pavagada Solar Park is in?", options: ["Rajasthan", "Karnataka", "Gujarat", "Tamil Nadu"], correct: 1, difficulty: "Medium" },
  { q: "India's position in global wind ranking?", options: ["2nd", "3rd", "4th", "5th"], correct: 2, difficulty: "Medium" },
  { q: "Floating solar share of total?", options: ["2%", "5%", "10%", "15%"], correct: 1, difficulty: "Hard" },
  { q: "Muppandal wind corridor is in?", options: ["Gujarat", "Karnataka", "Tamil Nadu", "Rajasthan"], correct: 2, difficulty: "Medium" },
  { q: "Wind onshore target 2030?", options: ["50 GW", "75 GW", "100 GW", "150 GW"], correct: 2, difficulty: "Easy" },
  { q: "Solar degradation rate per year?", options: ["0.1-0.3%", "0.5-0.7%", "1-2%", "3-5%"], correct: 1, difficulty: "Hard" },
  { q: "Bifacial solar market share?", options: ["10%", "15%", "25%", "35%"], correct: 2, difficulty: "Hard" },
  { q: "ReNew Energy total capacity?", options: ["8,000 MW", "11,000 MW", "14,000 MW", "17,000 MW"], correct: 1, difficulty: "Medium" },
  { q: "SECI stands for?", options: ["Solar Energy Corp of India", "State Electric Corp of India", "Sustainable Energy Council", "Solar Electric Commission"], correct: 0, difficulty: "Easy" },
  { q: "Wind turbine capacity in 1990s?", options: ["100 kW", "250 kW", "500 kW", "1 MW"], correct: 1, difficulty: "Medium" },
  { q: "Modern wind turbine capacity (2025)?", options: ["2 MW", "3.5 MW", "5.5 MW", "8 MW"], correct: 2, difficulty: "Medium" },
  { q: "Hailstorm EMV for solar?", options: ["₹20 Cr", "₹35 Cr", "₹45 Cr", "₹60 Cr"], correct: 2, difficulty: "Hard" },
  { q: "Top solar state by capacity?", options: ["Gujarat", "Rajasthan", "Karnataka", "Tamil Nadu"], correct: 1, difficulty: "Easy" },
  { q: "Kutch wind corridor capacity?", options: ["1,500 MW", "2,500 MW", "3,500 MW", "5,000 MW"], correct: 2, difficulty: "Hard" },
  { q: "Greenko's total RE capacity?", options: ["5,000 MW", "7,500 MW", "9,200 MW", "12,000 MW"], correct: 2, difficulty: "Medium" },
  { q: "Solar Performance Ratio range?", options: ["60-70%", "70-75%", "78-82%", "85-90%"], correct: 2, difficulty: "Hard" },
  { q: "Which is NOT a solar challenge?", options: ["Dust/soiling", "Evening ramp", "Bird mortality", "Grid curtailment"], correct: 2, difficulty: "Medium" },
  { q: "Rooftop solar share of total?", options: ["10%", "15%", "20%", "30%"], correct: 2, difficulty: "Medium" },
  { q: "NIWE is associated with?", options: ["Solar", "Wind", "Nuclear", "Hydro"], correct: 1, difficulty: "Easy" },
  { q: "India's total RE (Solar+Wind) FY25?", options: ["100 GW", "120 GW", "138 GW", "160 GW"], correct: 2, difficulty: "Easy" },
  { q: "Gearbox failure EMV (Wind)?", options: ["₹50 Cr", "₹70 Cr", "₹90 Cr", "₹120 Cr"], correct: 2, difficulty: "Hard" },
];

const REACTIONS = {
  correct: ['🎯 Brilliant!', '⚡ Electrifying!', '☀️ Solar-powered brain!', '🌬️ Breezing through!', '🔥 On fire!'],
  wrong: ['💡 Next time!', '📚 Keep learning!', '🔄 Try again!', '🎯 Almost there!'],
};

export default function REQuiz() {
  const { addQuizScore, quizScores, usedQuestionIndices, markQuestionsUsed, resetUsedQuestions } = useAppStore();
  const [phase, setPhase] = useState<'register' | 'playing' | 'result'>('register');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(20);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [reaction, setReaction] = useState('');
  const [powerUps, setPowerUps] = useState({ fiftyFifty: 2, extraTime: 2, skip: 2 });
  const [eliminated, setEliminated] = useState<number[]>([]);

  const startQuiz = () => {
    if (!name.trim()) return;

    // Get indices of questions NOT yet used
    let availableIndices = QUESTIONS.map((_, i) => i).filter((i) => !usedQuestionIndices.includes(i));

    // If fewer than 10 unused questions remain, reset the pool
    if (availableIndices.length < 10) {
      resetUsedQuestions();
      availableIndices = QUESTIONS.map((_, i) => i);
    }

    // Shuffle available and pick 10
    const shuffledIndices = availableIndices.sort(() => Math.random() - 0.5).slice(0, 10);
    const selectedQuestions = shuffledIndices.map((i) => QUESTIONS[i]);

    // Mark these as used
    markQuestionsUsed(shuffledIndices);

    setQuestions(selectedQuestions);
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setTimer(20);
    setPhase('playing');
    setSelected(null);
    setShowResult(false);
    setPowerUps({ fiftyFifty: 2, extraTime: 2, skip: 2 });
    setEliminated([]);
  };

  const getPoints = (q: Question, timeLeft: number) => {
    const base = q.difficulty === 'Easy' ? 10 : q.difficulty === 'Medium' ? 20 : 30;
    const speedBonus = Math.floor(timeLeft / 2);
    const streakMultiplier = 1 + (streak * 0.1);
    return Math.floor((base + speedBonus) * streakMultiplier);
  };

  const handleAnswer = useCallback((idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const q = questions[current];
    if (idx === q.correct) {
      const pts = getPoints(q, timer);
      setScore((s) => s + pts);
      setStreak((s) => s + 1);
      setReaction(REACTIONS.correct[Math.floor(Math.random() * REACTIONS.correct.length)]);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
      setStreak(0);
      setReaction(REACTIONS.wrong[Math.floor(Math.random() * REACTIONS.wrong.length)]);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        finishQuiz();
      } else {
        setCurrent((c) => c + 1);
        setTimer(20);
        setSelected(null);
        setShowResult(false);
        setEliminated([]);
        setReaction('');
      }
    }, 1500);
  }, [showResult, current, questions, timer, streak]);

  const finishQuiz = () => {
    const total = questions.reduce((acc, q) => {
      const base = q.difficulty === 'Easy' ? 10 : q.difficulty === 'Medium' ? 20 : 30;
      return acc + base + 10;
    }, 0);
    addQuizScore({ name, gender: '', score, total, date: new Date().toISOString() });
    setPhase('result');
  };

  const useFiftyFifty = () => {
    if (powerUps.fiftyFifty <= 0 || showResult) return;
    const q = questions[current];
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.correct);
    const toRemove = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminated(toRemove);
    setPowerUps((p) => ({ ...p, fiftyFifty: p.fiftyFifty - 1 }));
  };

  const useExtraTime = () => {
    if (powerUps.extraTime <= 0 || showResult) return;
    setTimer((t) => t + 10);
    setPowerUps((p) => ({ ...p, extraTime: p.extraTime - 1 }));
  };

  const useSkip = () => {
    if (powerUps.skip <= 0 || showResult) return;
    setPowerUps((p) => ({ ...p, skip: p.skip - 1 }));
    if (current + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrent((c) => c + 1);
      setTimer(20);
      setSelected(null);
      setShowResult(false);
      setEliminated([]);
    }
  };

  useEffect(() => {
    if (phase !== 'playing' || showResult) return;
    if (timer <= 0) {
      handleAnswer(-1);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, phase, showResult, handleAnswer]);

  const exitQuiz = () => {
    setPhase('register');
    setCurrent(0);
    setScore(0);
  };

  if (phase === 'register') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-5xl">🎮</span>
            <h2 className="text-2xl font-bold text-[#005B75] mt-2">RE Quiz Challenge</h2>
            <p className="text-sm text-gray-500">Test your Solar & Wind knowledge!</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75]"
                placeholder="Enter your name"
              />
            </div>
            <button
              onClick={startQuiz}
              disabled={!name.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#005B75] to-[#007A9E] text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              Start Quiz (10 Questions)
            </button>
          </div>
          {/* Leaderboard */}
          {quizScores.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-sm text-[#005B75] mb-2">🏆 Leaderboard</h4>
              <div className="space-y-1">
                {[...quizScores]
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((s, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{i + 1}. {s.name}</span>
                      <span className="font-bold text-[#F99D27]">{s.score} pts</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const pct = Math.round((score / questions.reduce((a, q) => a + (q.difficulty === 'Easy' ? 20 : q.difficulty === 'Medium' ? 30 : 40), 0)) * 100);
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm animate-fadeIn text-center">
          <span className="text-6xl">{pct >= 70 ? '🏆' : pct >= 40 ? '⭐' : '📚'}</span>
          <h2 className="text-2xl font-bold text-[#005B75] mt-3">Quiz Complete!</h2>
          <p className="text-lg mt-2">Score: <span className="font-bold text-[#F99D27]">{score}</span> points</p>
          <p className="text-sm text-gray-500 mt-1">{pct >= 70 ? 'Excellent! You know your RE!' : pct >= 40 ? 'Good effort! Keep learning!' : 'Time to brush up on Solar & Wind!'}</p>
          <div className="flex gap-3 mt-6">
            <button onClick={startQuiz} className="flex-1 py-3 bg-[#005B75] text-white font-bold rounded-xl hover:opacity-90">
              Play Again
            </button>
            <button onClick={() => setPhase('register')} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const timerColor = timer > 10 ? 'text-green-600' : timer > 5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Q {current + 1}/{questions.length} • {q.difficulty}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#F99D27]">{score} pts</span>
            {streak > 1 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🔥 {streak}x</span>}
            <span className={`text-lg font-bold ${timerColor}`}>{timer}s</span>
            <button onClick={exitQuiz} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200">✕ Exit</button>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-100 rounded-full mb-4">
          <div className="h-full bg-[#005B75] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <h3 className="text-lg font-bold text-[#005B75] mb-4">{q.q}</h3>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {q.options.map((opt, i) => {
            if (eliminated.includes(i)) return (
              <div key={i} className="p-3 rounded-xl bg-gray-50 text-gray-300 line-through text-sm">
                {opt}
              </div>
            );
            let bg = 'bg-[#F0F9FF] hover:bg-blue-100 border border-blue-100';
            if (showResult) {
              if (i === q.correct) bg = 'bg-green-100 border border-green-400';
              else if (i === selected && i !== q.correct) bg = 'bg-red-100 border border-red-400 animate-shake';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className={`p-3 rounded-xl text-left text-sm font-medium transition ${bg} ${showResult ? '' : 'cursor-pointer'}`}
              >
                <span className="font-bold text-[#005B75] mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Reaction */}
        {reaction && (
          <div className="text-center text-lg font-bold animate-fadeIn mb-3" style={{ color: selected === q.correct ? '#10B981' : '#EF4444' }}>
            {reaction}
          </div>
        )}

        {/* Power-ups */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={useFiftyFifty}
            disabled={powerUps.fiftyFifty <= 0 || showResult}
            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            50:50 ({powerUps.fiftyFifty})
          </button>
          <button
            onClick={useExtraTime}
            disabled={powerUps.extraTime <= 0 || showResult}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            +10s ({powerUps.extraTime})
          </button>
          <button
            onClick={useSkip}
            disabled={powerUps.skip <= 0 || showResult}
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            Skip ({powerUps.skip})
          </button>
        </div>
      </div>
    </div>
  );
}
