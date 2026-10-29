import React, { useState, useRef, useEffect } from 'react';
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
  Flame,
  Vibrate
} from 'lucide-react';
import { GameStats, InputState } from '../game/types';
import { sound } from '../game/audio';
import { haptic } from '../game/haptics';

interface GameHUDProps {
  stats: GameStats;
  input: InputState;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ stats, input, onPause }) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isMusicMuted, setIsMusicMuted] = useState(sound.getIsMusicMuted());
  const [isHapticEnabled, setIsHapticEnabled] = useState(haptic.getIsEnabled());
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [autoFire, setAutoFire] = useState(false);

  // Virtual Joystick state
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState(false);

  // Auto fire interval
  useEffect(() => {
    let interval: number | null = null;
    if (autoFire && stats.gameStarted && !stats.isPaused && !stats.isGameOver) {
      input.isShooting = true;
    } else if (!autoFire && !isDraggingStick) {
      // Don't override if manual holding
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoFire, stats.gameStarted, stats.isPaused, stats.isGameOver, input]);

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

  const toggleHaptics = () => {
    const next = !isHapticEnabled;
    setIsHapticEnabled(next);
    haptic.setEnabled(next);
    if (next) haptic.tap();
  };

  // Virtual Analog Joystick touch handlers
  const handleJoystickTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickBaseRef.current) return;
    const touch = e.touches[0];
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = rect.width / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setStickPos({ x: stickX, y: stickY });
    setIsDraggingStick(true);

    // Normalize to -1.0 .. 1.0 (inverted Y for 3D flight)
    input.moveX = stickX / maxRadius;
    input.moveY = -(stickY / maxRadius);
  };

  const handleJoystickEnd = () => {
    setStickPos({ x: 0, y: 0 });
    setIsDraggingStick(false);
    input.moveX = 0;
    input.moveY = 0;
  };

  const handleManualShoot = (active: boolean) => {
    if (!autoFire) {
      input.isShooting = active;
    }
    if (active) haptic.tap();
  };

  const handleTouchBoost = (active: boolean) => {
    input.isBoosting = active;
    if (active) haptic.tap();
  };

  const playerHpPct = Math.max(0, Math.min(100, (stats.playerHealth / stats.playerMaxHealth) * 100));
  const playerShieldPct = Math.max(0, Math.min(100, (stats.playerShield / stats.playerMaxShield) * 100));
  const enemyHpPct = stats.enemyMaxHealth > 0 ? Math.max(0, Math.min(100, (stats.enemyHealth / stats.enemyMaxHealth) * 100)) : 0;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-2 sm:p-5 pt-[max(0.6rem,env(safe-area-inset-top))] pb-[max(0.6rem,env(safe-area-inset-bottom))] pl-[max(0.6rem,env(safe-area-inset-left))] pr-[max(0.6rem,env(safe-area-inset-right))]">
      {/* TOP BAR: Player gauges, Enemy Boss Bar, Score Cluster & Mobile Pause */}
      <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between gap-1.5 sm:gap-4">
        {/* Mobile Header Row (Player HP + Pause + Score) */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* Left: Player Status (Shield & Hull) */}
          <div className="pointer-events-auto bg-slate-950/85 border border-slate-800/80 rounded-xl p-2 sm:p-3 w-36 sm:w-56 shadow-lg">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-wider text-pink-400 mb-1">
              <span className="flex items-center gap-1 font-orbitron">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500 inline-block"></span>
                ALUS
              </span>
              <span className="text-slate-400 font-mono text-[9px] sm:text-[10px]">T{stats.level}</span>
            </div>

            {/* Shield Bar */}
            <div className="space-y-0.5 mb-1.5">
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-cyan-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" /> KILPI
                </span>
                <span className="tabular-nums font-mono">{stats.playerShield}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-150"
                  style={{ width: `${playerShieldPct}%` }}
                />
              </div>
            </div>

            {/* Hull Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-pink-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400" /> RUNKO
                </span>
                <span className="tabular-nums font-mono">{stats.playerHealth}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-pink-900/50">
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

          {/* Center on Desktop, Inline on Mobile: 3D Enemy Boss Bar */}
          <div className="pointer-events-auto flex-1 max-w-sm sm:max-w-md mx-auto text-center bg-slate-950/85 border border-red-500/30 rounded-xl p-1.5 sm:p-2.5 shadow-lg">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1 font-orbitron">
              <span className="flex items-center gap-1 text-red-400 font-bold truncate max-w-[140px] sm:max-w-none">
                <Crosshair className="w-3 h-3 text-red-400" />
                {stats.enemyName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">
                HP: <span className="text-white font-bold tabular-nums">{stats.enemyHealth}</span>/{stats.enemyMaxHealth}
              </span>
            </div>

            {/* Enemy HP segments */}
            <div className="w-full h-2.5 sm:h-3 bg-slate-900 rounded-md overflow-hidden border border-red-950 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-amber-400 rounded-xs transition-all duration-150 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                style={{ width: `${enemyHpPct}%` }}
              />
            </div>
          </div>

          {/* Right: Score & Quick Pause */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <div className="bg-slate-950/85 border border-slate-800/80 rounded-xl p-2 sm:p-3 text-right shadow-lg min-w-[90px] sm:min-w-[130px]">
              <div className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-mono">Pisteet</div>
              <div className="text-base sm:text-2xl font-black font-orbitron text-emerald-400 tabular-nums glow-green">
                {stats.score.toLocaleString()}
              </div>
            </div>

            <button
              onClick={onPause}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors shadow-lg"
              title="Tauko"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* WAVE CLEAR NOTICE NOTIFICATION */}
      {stats.waveClearNotice && (
        <div className="self-center my-auto pointer-events-none animate-in zoom-in-95 duration-200 px-4 text-center">
          <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 border border-emerald-400/60 rounded-2xl py-2.5 sm:py-3 px-5 sm:px-6 shadow-2xl shadow-emerald-500/30">
            <div className="text-emerald-400 font-orbitron font-black text-base sm:text-2xl tracking-wider glow-green">
              {stats.waveClearNotice}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-mono mt-0.5">
              Vaikeustaso nousee · Valmistaudu sotalaivan hyökkäykseen!
            </div>
          </div>
        </div>
      )}

      {/* SMARTPHONE MOBILE TOUCH CONTROLS (Virtual Joystick + Combat Cluster) */}
      <div className="pointer-events-auto flex justify-between items-end w-full px-2 sm:px-6 pb-2">
        {/* Left: Virtual Analog Joystick */}
        <div className="flex flex-col items-center">
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouch}
            onTouchMove={handleJoystickTouch}
            onTouchEnd={handleJoystickEnd}
            onTouchCancel={handleJoystickEnd}
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-950/70 border-2 border-pink-500/30 flex items-center justify-center shadow-2xl backdrop-blur-xs touch-none"
          >
            {/* Inner guideline circles */}
            <div className="absolute w-20 h-20 rounded-full border border-pink-500/20" />
            <div className="absolute w-10 h-10 rounded-full border border-pink-500/25" />

            {/* Draggable Stick Handle */}
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-700 border-2 border-white shadow-lg shadow-pink-500/50 flex items-center justify-center transition-transform ${
                isDraggingStick ? 'scale-105 duration-0' : 'duration-150'
              }`}
              style={{
                transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
              }}
            >
              <div className="w-4 h-4 rounded-full bg-white/80" />
            </div>
          </div>
          <span className="text-[10px] text-pink-300 font-mono mt-1 opacity-70">OHJAUS</span>
        </div>

        {/* Right: Mobile Combat Controls (Fire, Auto-fire toggle, Boost) */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Top row: Auto-Fire Toggle & Boost */}
          <div className="flex items-center gap-2">
            {/* Auto-fire toggle button */}
            <button
              onClick={() => {
                const next = !autoFire;
                setAutoFire(next);
                input.isShooting = next;
                haptic.tap();
              }}
              className={`px-3 py-1.5 rounded-full border text-[10px] font-orbitron font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer ${
                autoFire
                  ? 'bg-emerald-600 border-emerald-300 text-white shadow-emerald-500/50'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300'
              }`}
            >
              <Zap className="w-3 h-3" />
              {autoFire ? 'AUTOTULI: PÄÄLLÄ' : 'AUTOTULI: POIS'}
            </button>

            {/* Boost button */}
            <button
              onTouchStart={() => handleTouchBoost(true)}
              onTouchEnd={() => handleTouchBoost(false)}
              onMouseDown={() => handleTouchBoost(true)}
              onMouseUp={() => handleTouchBoost(false)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-950/85 border-2 border-cyan-400 active:bg-cyan-600 flex flex-col items-center justify-center text-cyan-200 shadow-xl text-[10px] font-bold cursor-pointer touch-none"
            >
              <Flame className="w-5 h-5 text-cyan-300 mb-0.5" />
              BOOST
            </button>
          </div>

          {/* Big Green Plasma Fire Button */}
          <button
            onTouchStart={() => handleManualShoot(true)}
            onTouchEnd={() => handleManualShoot(false)}
            onMouseDown={() => handleManualShoot(true)}
            onMouseUp={() => handleManualShoot(false)}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer touch-none ${
              autoFire
                ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-300 opacity-80'
                : 'bg-emerald-950/95 border-emerald-400 active:bg-emerald-600 text-emerald-200 shadow-emerald-500/40'
            }`}
          >
            <img
              src="./assets/aistudio/minute_06a99cad.png"
              alt="Plasma"
              className="w-6 h-9 sm:w-8 sm:h-11 object-contain drop-shadow-[0_0_6px_#22c55e] -mb-1"
            />
            <span className="text-[11px] font-orbitron font-black tracking-wide">AMMU</span>
          </button>
        </div>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM DOCK (For sound, music, vibration, hints) */}
      <div className="pointer-events-auto self-center flex flex-col items-center">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsDockExpanded(!isDockExpanded)}
          className="px-3 py-0.5 bg-slate-900/90 border-t border-x border-slate-700/80 rounded-t-lg text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isDockExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          {isDockExpanded ? 'Piilota ääniasetukset' : 'Ääni & Tärinä'}
        </button>

        {/* Main Dock Container */}
        {isDockExpanded && (
          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl px-3 py-1.5 flex items-center gap-3 sm:gap-6 shadow-2xl mb-1">
            {/* Audio & Music & Haptics controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMasterMute}
                title={isMuted ? 'Poista mykistys' : 'Mykistä äänet'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={toggleMusic}
                title={isMusicMuted ? 'Kytke musiikki päälle' : 'Mykistä musiikki'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isMusicMuted
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleHaptics}
                title={isHapticEnabled ? 'Tärinäpalaute päällä' : 'Tärinäpalaute pois'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  !isHapticEnabled
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Vibrate className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick desktop control guides */}
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">WASD</kbd>
                <span>Liiku</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">Väli / Hiiri</kbd>
                <span>Ammu</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">Shift</kbd>
                <span>Boost</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
