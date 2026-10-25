import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Pause,
  ChevronDown,
  ChevronUp,
  Shield,
  Heart,
  Zap,
  Target,
  Crosshair,
  Flame
} from 'lucide-react';
import { GameStats, InputState } from '../game/types';
import { sound } from '../game/audio';

interface GameHUDProps {
  stats: GameStats;
  input: InputState;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ stats, input, onPause }) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isMusicMuted, setIsMusicMuted] = useState(sound.getIsMusicMuted());
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  const toggleMasterMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMute(next);
  };

  const toggleMusic = () => {
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    sound.toggleMusic(next);
  };

  // Virtual touch controls handlers
  const handleTouchDirection = (dx: number, dy: number) => {
    input.moveX = dx;
    input.moveY = dy;
  };

  const handleTouchShoot = (active: boolean) => {
    input.isShooting = active;
  };

  const handleTouchBoost = (active: boolean) => {
    input.isBoosting = active;
  };

  const playerHpPct = Math.max(0, Math.min(100, (stats.playerHealth / stats.playerMaxHealth) * 100));
  const playerShieldPct = Math.max(0, Math.min(100, (stats.playerShield / stats.playerMaxShield) * 100));
  const enemyHpPct = stats.enemyMaxHealth > 0 ? Math.max(0, Math.min(100, (stats.enemyHealth / stats.enemyMaxHealth) * 100)) : 0;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-3 sm:p-5">
      {/* TOP BAR: Player gauges, Enemy Boss Bar, Score Cluster */}
      <div className="w-full flex items-start justify-between gap-2 sm:gap-4">
        {/* Left: Player Status (Shield & Hull) */}
        <div className="pointer-events-auto bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 w-44 sm:w-56 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-pink-400 mb-2">
            <span className="flex items-center gap-1 font-orbitron">
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>
              OMA ALUS
            </span>
            <span className="text-slate-400 font-mono text-[10px]">TASO {stats.level}</span>
          </div>

          {/* Shield Bar */}
          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center text-[10px] text-cyan-300 font-semibold">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" /> KILPI
              </span>
              <span className="tabular-nums font-mono">{stats.playerShield}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-150"
                style={{ width: `${playerShieldPct}%` }}
              />
            </div>
          </div>

          {/* Hull Integrity Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-pink-300 font-semibold">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" /> RUNKO
              </span>
              <span className="tabular-nums font-mono">{stats.playerHealth}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-pink-900/50">
              <div
                className={`h-full transition-all duration-150 ${
                  playerHpPct > 35
                    ? 'bg-gradient-to-r from-pink-600 to-pink-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${playerHpPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: 3D Enemy Boss Bar */}
        <div className="pointer-events-auto flex-1 max-w-sm sm:max-w-md mx-auto text-center bg-slate-950/85 border border-red-500/30 rounded-xl p-2 sm:p-2.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] mb-1 font-orbitron">
            <span className="flex items-center gap-1.5 text-red-400 font-bold truncate max-w-[200px] sm:max-w-none">
              <Crosshair className="w-3.5 h-3.5 text-red-400" />
              {stats.enemyName}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              HP: <span className="text-white font-bold tabular-nums">{stats.enemyHealth}</span> / {stats.enemyMaxHealth}
            </span>
          </div>

          {/* Enemy HP segments */}
          <div className="w-full h-3 bg-slate-900 rounded-md overflow-hidden border border-red-950 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-amber-400 rounded-xs transition-all duration-150 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              style={{ width: `${enemyHpPct}%` }}
            />
          </div>
        </div>

        {/* Right: Score, High Score, Wave */}
        <div className="pointer-events-auto bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 text-right shadow-lg min-w-[120px] sm:min-w-[150px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Pisteet</div>
          <div className="text-xl sm:text-2xl font-black font-orbitron text-emerald-400 tabular-nums glow-green">
            {stats.score.toLocaleString()}
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-yellow-400 font-mono mt-0.5">
            <span>ENNÄTYS:</span>
            <span className="font-bold tabular-nums">{stats.highScore.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* WAVE CLEAR NOTICE NOTIFICATION */}
      {stats.waveClearNotice && (
        <div className="self-center my-auto pointer-events-none animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 border border-emerald-400/60 rounded-2xl py-3 px-6 text-center shadow-2xl shadow-emerald-500/30">
            <div className="text-emerald-400 font-orbitron font-black text-lg sm:text-2xl tracking-wider glow-green">
              {stats.waveClearNotice}
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              Vaikeustaso nousee · Valmistaudu sotalaivan hyökkäykseen!
            </div>
          </div>
        </div>
      )}

      {/* MOBILE TOUCH CONTROLS (Only visible on small touch screens or when user touches) */}
      <div className="sm:hidden pointer-events-auto flex justify-between items-end w-full px-2 mb-16">
        {/* Virtual D-pad / directional pad */}
        <div className="grid grid-cols-3 gap-1 w-32 h-32 bg-slate-950/70 p-2 rounded-2xl border border-slate-800">
          <div />
          <button
            onTouchStart={() => handleTouchDirection(0, 1)}
            onTouchEnd={() => handleTouchDirection(0, 0)}
            className="bg-slate-800/80 active:bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={() => handleTouchDirection(-1, 0)}
            onTouchEnd={() => handleTouchDirection(0, 0)}
            className="bg-slate-800/80 active:bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          >
            ◀
          </button>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-pink-500/40"></span>
          </div>
          <button
            onTouchStart={() => handleTouchDirection(1, 0)}
            onTouchEnd={() => handleTouchDirection(0, 0)}
            className="bg-slate-800/80 active:bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          >
            ▶
          </button>
          <div />
          <button
            onTouchStart={() => handleTouchDirection(0, -1)}
            onTouchEnd={() => handleTouchDirection(0, 0)}
            className="bg-slate-800/80 active:bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          >
            ▼
          </button>
          <div />
        </div>

        {/* Action Buttons (Fire & Boost) */}
        <div className="flex items-center gap-3">
          {/* Boost button */}
          <button
            onTouchStart={() => handleTouchBoost(true)}
            onTouchEnd={() => handleTouchBoost(false)}
            className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-500/50 active:bg-cyan-600 flex flex-col items-center justify-center text-cyan-300 shadow-lg text-[10px] font-bold"
          >
            <Flame className="w-5 h-5 mb-0.5" />
            BOOST
          </button>

          {/* Fire button with minute.png plasma bolt icon */}
          <button
            onTouchStart={() => handleTouchShoot(true)}
            onTouchEnd={() => handleTouchShoot(false)}
            className="w-20 h-20 rounded-full bg-emerald-950/90 border-2 border-emerald-400 active:bg-emerald-600 flex flex-col items-center justify-center text-emerald-300 shadow-xl text-xs font-bold"
          >
            <img src="/assets/aistudio/minute_06a99cad.png" alt="Tuli" className="w-6 h-9 object-contain -mb-1" />
            AMMU
          </button>
        </div>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM DOCK */}
      <div className="pointer-events-auto self-center flex flex-col items-center">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className="px-3 py-1 bg-slate-900/90 border-t border-x border-slate-700/80 rounded-t-lg text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isDockExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          {isDockExpanded ? 'Piilota ohjauspalkki' : 'Näytä ohjauspalkki'}
        </button>

        {/* Main Dock Container */}
        {isDockExpanded && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-4 sm:gap-6 shadow-2xl">
            {/* Audio & Music controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMasterMute}
                title={isMuted ? 'Poista mykistys' : 'Mykistä äänet'}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleMusic}
                title={isMusicMuted ? 'Kytke musiikki päälle' : 'Mykistä musiikki'}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isMusicMuted
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Music className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            {/* Quick control guides */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">WASD</kbd>
                <span>Liiku</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">Välilyönti</kbd>
                <span>Plasma-ammus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">Shift</kbd>
                <span>Boost</span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Pause CTA */}
            <button
              onClick={onPause}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Tauko"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
