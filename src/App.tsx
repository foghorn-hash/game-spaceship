import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameController } from './game/gameController';
import { GameStats } from './game/types';
import { StartScreen } from './components/StartScreen';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameController | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    level: 1,
    enemiesDestroyed: 0,
    playerHealth: 100,
    playerMaxHealth: 100,
    playerShield: 100,
    playerMaxShield: 100,
    enemyHealth: 5,
    enemyMaxHealth: 5,
    enemyName: 'KYBER-TIEDUSTELIJA (MK-I)',
    isPaused: false,
    isGameOver: false,
    gameStarted: false,
    waveClearNotice: null,
  });

  const handleStatsUpdate = useCallback((newStats: GameStats) => {
    setStats(newStats);
  }, []);

  // Initialize Game on Mount
  useEffect(() => {
    if (!mountRef.current) return;

    const game = new GameController(mountRef.current, handleStatsUpdate);
    gameRef.current = game;

    const handleResize = () => {
      if (mountRef.current && gameRef.current) {
        gameRef.current.resize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.dispose();
      gameRef.current = null;
    };
  }, [handleStatsUpdate]);

  const handleStartGame = () => {
    if (gameRef.current) {
      gameRef.current.startGame();
    }
  };

  const handleRestartGame = () => {
    if (gameRef.current) {
      gameRef.current.restartGame();
    }
  };

  const handlePauseToggle = () => {
    if (gameRef.current) {
      gameRef.current.togglePause();
    }
  };

  // Keyboard shortcut listener for Enter / Space on start & gameover screens
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (!stats.gameStarted) {
          handleStartGame();
        } else if (stats.isGameOver) {
          handleRestartGame();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [stats.gameStarted, stats.isGameOver]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* Isolated Three.js WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 w-full h-full cursor-crosshair"
      />

      {/* Start Screen Title Shell */}
      {!stats.gameStarted && (
        <StartScreen onStart={handleStartGame} highScore={stats.highScore} />
      )}

      {/* Active In-Game HUD */}
      {stats.gameStarted && gameRef.current && (
        <GameHUD
          stats={stats}
          input={gameRef.current.input}
          onPause={handlePauseToggle}
        />
      )}

      {/* Pause Menu Modal */}
      {stats.isPaused && !stats.isGameOver && (
        <PauseModal onResume={handlePauseToggle} onRestart={handleRestartGame} />
      )}

      {/* Game Over Modal */}
      {stats.isGameOver && (
        <GameOverModal stats={stats} onRestart={handleRestartGame} />
      )}
    </div>
  );
}
