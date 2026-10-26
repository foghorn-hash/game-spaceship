import React, { useState } from 'react';
import { Play, Shield, Zap, Crosshair, Award, Info, X, FileText, CheckCircle2 } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Title lockup */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-950/40 text-pink-400 text-xs font-semibold tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            3D Plasma Space Combat
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-emerald-400 font-orbitron glow-magenta">
            PLASMA VOID 3D
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
            Ohjaa neon-alustasi 3D-avaruudessa, ammu kiihdytettyjä plasmapuikkoja ja tuhoa kehittyvä 3D-avaruussotalaiva.
          </p>
        </div>

        {/* Feature showcase preview cards */}
        <div className="grid grid-cols-3 gap-3 text-left">
          {/* Player Ship */}
          <div className="bg-slate-900/80 border border-pink-500/30 rounded-xl p-3 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-lg bg-pink-950/40 border border-pink-500/20 flex items-center justify-center p-1 mb-2">
              <img
                src="./assets/aistudio/ship_f10530f0.png"
                alt="Pelihahmo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_#ff00b4]"
              />
            </div>
            <span className="text-xs font-bold text-pink-300">2D Alus</span>
            <span className="text-[10px] text-slate-400">3D-kallistus & kilpi</span>
          </div>

          {/* Minute Plasma Bolt */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center p-1 mb-2">
              <img
                src="./assets/aistudio/minute_06a99cad.png"
                alt="Ammus"
                className="w-8 h-12 object-contain drop-shadow-[0_0_8px_#22c55e]"
              />
            </div>
            <span className="text-xs font-bold text-emerald-300">Plasmapuikko</span>
            <span className="text-[10px] text-slate-400">3D-kiihdytetty isku</span>
          </div>

          {/* 3D Battleship */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-3 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center p-1 mb-2">
              <Crosshair className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-cyan-300">3D Vihollinen</span>
            <span className="text-[10px] text-slate-400">Vaikeutuva sotalaiva</span>
          </div>
        </div>

        {/* High Score & License buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {highScore > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-900/90 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
              <Award className="w-4 h-4 text-yellow-400" />
              Ennätys: <span className="text-white tabular-nums">{highScore.toLocaleString()}</span> pistettä
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowLicenseModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-pink-400" />
            MIT-Lisenssi & Kauppa-info
          </button>
        </div>

        {/* Start Button */}
        <div>
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-600 via-purple-600 to-emerald-600 hover:from-pink-500 hover:to-emerald-500 text-white font-orbitron font-bold text-lg rounded-xl shadow-lg shadow-pink-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3 mx-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            ALOITA TAISTELU
          </button>
          <p className="text-xs text-slate-400 mt-2 font-mono">Paina Välilyöntiä tai Enteriä aloittaaksesi</p>
        </div>

        {/* Controls legend */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">WASD / Nuolet</kbd>
            <span>Ohjaa</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">Välilyönti / Hiiri</kbd>
            <span>Ammu</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">Shift</kbd>
            <span>Kiihdytys</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">P / Esc</kbd>
            <span>Tauko</span>
          </div>
        </div>
      </div>

      {/* MIT License & Store Compatibility Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-text">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 text-left space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" />
                <h3 className="font-orbitron font-bold text-base text-white">Lisenssitiedot & Kauppajulkaisu</h3>
              </div>
              <button
                onClick={() => setShowLicenseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* License summary badge */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                MIT-Lisenssi: 100 % Yhteensopiva Sovelluskauppoihin
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tämä peli on lisensoitu sallivalla <strong>MIT-lisenssillä</strong> (Copyright © 2026 Matti Kiviharju). Voit julkaista, myydä ja kaupallistaa pelin vapaasti <strong>Apple App Storessa</strong> ja <strong>Google Play Storessa</strong>.
              </p>
            </div>

            {/* Store details */}
            <div className="space-y-2 text-xs text-slate-300">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wide text-pink-400">
                Pelin julkaiseminen sovelluskaupoissa:
              </h4>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span><strong>Apple App Store:</strong> MIT ei sisällä GPL-tyylisiä DRM-rajoitteita, joten se on täysin yhteensopiva Applen App Store EULA:n kanssa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span><strong>Google Play:</strong> Täysi tuki ilmaiselle, maksulliselle tai mainosrahoitteiselle julkaisulle Android-sovelluksena.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span><strong>Kaupallistaminen:</strong> Voit myydä peliä, lisätä sovelluksen sisäisiä ostoja (IAP) tai käyttää mainoksia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span><strong>Suljettu lähdekoodi:</strong> Sinun ei tarvitse avata koodiasi sovelluskauppaan viemisen yhteydessä.</span>
                </li>
              </ul>
            </div>

            {/* Official MIT Text */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wide text-slate-400">
                Virallinen lisenssiteksti (LICENSE):
              </h4>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
{`MIT License

Copyright (c) 2026 Matti Kiviharju

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`}
              </pre>
            </div>

            {/* Third-party open source credits */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300">Kolmannen osapuolen kirjastot:</span>
              <p>Three.js (MIT), React (MIT), Lucide (ISC/MIT), Tailwind CSS (MIT).</p>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
