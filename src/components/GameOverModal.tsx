import React from 'react';
import { RotateCcw, Trophy, Skull, Target, Zap, Shield } from 'lucide-react';
import { GameStats } from '../game/types';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-slate-950/90 border border-red-500/40 rounded-2xl p-6 text-center shadow-2xl shadow-red-950/60 space-y-6">
        {/* Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Skull className="w-3.5 h-3.5" />
            Alus tuhoutunut
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-red-500 tracking-wide">
            PELI PÄÄTTYI
          </h2>
        </div>

        {/* New Record Banner */}
        {isNewHighScore && (
          <div className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-yellow-500/50 flex items-center justify-center gap-2 text-yellow-300 font-bold text-sm">
            <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
            UUSI ENNÄTYS!
          </div>
        )}

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pisteet</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-orbitron tabular-nums">
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Ennätys</span>
            </div>
            <div className="text-2xl font-black text-yellow-400 font-orbitron tabular-nums">
              {stats.highScore.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Target className="w-3.5 h-3.5 text-pink-400" />
              <span>Tuhotut alukset</span>
            </div>
            <div className="text-2xl font-black text-pink-400 font-orbitron tabular-nums">
              {stats.enemiesDestroyed}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Saavutettu taso</span>
            </div>
            <div className="text-2xl font-black text-cyan-400 font-orbitron tabular-nums">
              {stats.level}
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div>
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-orbitron font-bold text-base rounded-xl shadow-lg shadow-emerald-950/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            PELAA UUDELLEEN
          </button>
          <p className="text-xs text-slate-400 mt-2 font-mono">Paina Välilyöntiä tai Enteriä</p>
        </div>
      </div>
    </div>
  );
};
