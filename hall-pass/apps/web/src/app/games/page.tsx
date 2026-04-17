'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGameStore, miniGames } from '@hallpass/game-engine';

// Quiz Game
function QuizGame({ onComplete }: { onComplete: (score: number) => void }) {
  const questions = [
    { q: 'What is the powerhouse of the cell?', a: ['Mitochondria', 'Nucleus', 'Ribosome'], correct: 0 },
    { q: 'Who wrote "Romeo and Juliet"?', a: ['Charles Dickens', 'William Shakespeare', 'Jane Austen'], correct: 1 },
    { q: 'What is 8 × 7?', a: ['54', '56', '58'], correct: 1 },
    { q: 'What planet is known as the Red Planet?', a: ['Venus', 'Mars', 'Jupiter'], correct: 1 },
  ];
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (idx: number) => {
    if (idx === questions[current].correct) {
      setScore(s => s + 1);
    }
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      onComplete(Math.floor((score / questions.length) * 100));
    }
  };

  return (
    <div className="bg-[#16162a] rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold mb-6">Quiz Bowl</h3>
      <p className="text-lg mb-6">{questions[current].q}</p>
      <div className="space-y-3">
        {questions[current].a.map((ans, idx) => (
          <button
            key={idx}
            onClick={() => answer(idx)}
            className="w-full py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {ans}
          </button>
        ))}
      </div>
      <p className="mt-4 text-gray-400">Score: {score}/{questions.length}</p>
    </div>
  );
}

// Basketball Game
function BasketballGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const shoot = () => {
    const made = Math.random() > 0.4;
    if (made) setScore(s => s + 1);
  };

  return (
    <div className="bg-[#16162a] rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold mb-4">Basketball Shootout</h3>
      <p className="text-[#fbbf24] mb-2">Time: {timeLeft}s</p>
      <p className="text-4xl font-bold mb-6">{score} baskets</p>
      <button
        onClick={shoot}
        className="px-8 py-4 bg-orange-500 rounded-xl text-xl font-bold hover:bg-orange-600 transition-colors"
      >
        🏀 SHOOT!
      </button>
      <button
        onClick={() => onComplete(score * 10)}
        className="block w-full mt-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        End Game
      </button>
    </div>
  );
}

// Rhythm Game
function RhythmGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const tap = () => {
    const onBeat = Math.random() > 0.3;
    if (onBeat) {
      setCombo(c => c + 1);
      setHits(h => h + 1);
    } else {
      setCombo(0);
      setMisses(m => m + 1);
    }
  };

  const total = hits + misses;
  const accuracy = total > 0 ? (hits / total) * 100 : 0;

  return (
    <div className="bg-[#16162a] rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold mb-4">Band Practice</h3>
      <p className="text-3xl text-[#fbbf24] mb-2">🔥 Combo: {combo}</p>
      <p className="text-xl text-gray-400 mb-6">Accuracy: {accuracy.toFixed(0)}%</p>
      <button
        onClick={tap}
        className="px-8 py-4 bg-purple-500 rounded-xl text-xl font-bold hover:bg-purple-600 transition-colors"
      >
        🎵 TAP TO THE BEAT!
      </button>
      <button
        onClick={() => onComplete(Math.floor(accuracy * 10))}
        className="block w-full mt-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Finish
      </button>
    </div>
  );
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const recordMiniGameScore = useGameStore((state) => state.recordMiniGameScore);

  const handleGameComplete = (gameId: string, score: number) => {
    recordMiniGameScore(gameId, score);
    setActiveGame(null);
    alert(`Game complete! Score: ${score}. Cool Points earned!`);
  };

  const archetypeIcons: Record<string, string> = {
    nerd: '🤓',
    jock: '🏃',
    popular: '👑',
    goth: '🖤',
    artist: '🎨',
    hybrid: '🎲',
  };

  const archetypeColors: Record<string, string> = {
    nerd: '#3b82f6',
    jock: '#ef4444',
    popular: '#ec4899',
    goth: '#6366f1',
    artist: '#f59e0b',
    hybrid: '#a1a1aa',
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      <h1 className="text-3xl font-bold mb-2">🎮 Mini Games</h1>
      <p className="text-gray-400 mb-6">Play to earn Cool Points!</p>

      {activeGame ? (
        <div className="max-w-md mx-auto">
          {activeGame === 'quiz_bowl' && <QuizGame onComplete={(s) => handleGameComplete('quiz_bowl', s)} />}
          {activeGame === 'basketball_shoot' && <BasketballGame onComplete={(s) => handleGameComplete('basketball_shoot', s)} />}
          {activeGame === 'band_practice' && <RhythmGame onComplete={(s) => handleGameComplete('band_practice', s)} />}
          <button
            onClick={() => setActiveGame(null)}
            className="w-full mt-4 py-3 text-indigo-400 hover:text-indigo-300"
          >
            Quit
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {miniGames.map((game) => (
            <div
              key={game.id}
              className={`bg-[#16162a] rounded-xl p-4 border-2 ${
                game.dailyPlays >= game.maxDailyPlays ? 'opacity-50' : 'cursor-pointer hover:bg-[#1a1a2e]'
              }`}
              style={{ borderColor: archetypeColors[game.archetype] }}
              onClick={() => game.dailyPlays < game.maxDailyPlays && setActiveGame(game.id)}
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl">{archetypeIcons[game.archetype]}</span>
                <div>
                  <h3 className="font-bold">{game.name}</h3>
                  <span 
                    className="text-xs font-bold tracking-wider"
                    style={{ color: archetypeColors[game.archetype] }}
                  >
                    {game.archetype.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">{game.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#22d3ee]">+{game.rewards.coolPoints} Cool Points</span>
                <span className="text-gray-500">{game.dailyPlays}/{game.maxDailyPlays} plays</span>
              </div>
              {game.dailyPlays >= game.maxDailyPlays && (
                <div className="mt-2 text-center text-gray-400 text-sm">Come back tomorrow!</div>
              )}
            </div>
          ))}
        </div>
      )}

      <Link href="/">
        <button className="mt-6 px-6 py-3 text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}
