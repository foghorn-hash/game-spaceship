import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="max-w-sm w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-6 text-center space-y-5">
        <h2 className="text-2xl font-black font-orbitron text-white tracking-wider">
          TAUKO
        </h2>
        <p className="text-sm text-slate-400">Peli on keskeytetty.</p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-orbitron font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            JATKA PELIÄ
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-orbitron font-semibold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            ALOITA ALUSTA
          </button>
        </div>
      </div>
    </div>
  );
};
