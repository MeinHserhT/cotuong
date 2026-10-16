'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  SlidersHorizontal,
  Swords,
  Trophy,
  Drama,
  User,
  X,
  Play
} from 'lucide-react';
import { BotDifficulty, getRankTier } from '@/lib/xiangqi-types';
import { VariantEloStats } from './UnifiedGameConsole';

export interface StartGameMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'standard' | 'jieqi';
  onChangeVariant: (variant: 'standard' | 'jieqi') => void;
  gameMode: 'pve-red' | 'pve-black' | 'pvp' | 'online' | null;
  onChangeGameMode: (mode: 'pve-red' | 'pve-black' | 'pvp' | 'online') => void;
  difficulty: BotDifficulty;
  onChangeDifficulty: (diff: BotDifficulty) => void;
  eloStandard?: number;
  eloJieqi?: number;
  statsStandard?: VariantEloStats;
  statsJieqi?: VariantEloStats;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  onStartGame: () => void;
  onFlyToConsole?: () => void;
  colorMode?: 'dark' | 'light';
}

export const StartGameMenuModal: React.FC<StartGameMenuModalProps> = React.memo(({
  isOpen,
  onClose,
  variant = 'standard',
  onChangeVariant,
  gameMode,
  onChangeGameMode,
  difficulty,
  onChangeDifficulty,
  eloStandard = 1200,
  eloJieqi = 1200,
  statsStandard,
  statsJieqi,
  onOpenProfile,
  onOpenLeaderboard,
  onStartGame,
  onFlyToConsole,
  colorMode = 'dark'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlyingOut, setIsFlyingOut] = useState(false);
  const [flyCoords, setFlyCoords] = useState<{ dx: number; dy: number; scale: number } | null>(null);

  const triggerFlyToConsole = useCallback(
    (onComplete: () => void) => {
      if (isFlyingOut) return;

      let dx = 0;
      let dy = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.58) : 420;
      let scale = 0.88;

      if (cardRef.current && typeof window !== 'undefined') {
        const cardRect = cardRef.current.getBoundingClientRect();
        const targetEl = document.getElementById('game-console-dock');
        if (targetEl) {
          const targetRect = targetEl.getBoundingClientRect();
          if (targetRect.width > 0 && targetRect.height > 0) {
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + Math.min(targetRect.height, cardRect.height) / 2;

            dx = Math.round(targetCenterX - cardCenterX);
            const rawDy = Math.round(targetCenterY - cardCenterY);

            const maxVisibleDy = Math.round(window.innerHeight - cardRect.top - 20);
            if (targetRect.top > window.innerHeight * 0.85) {
              dy = Math.max(240, Math.min(rawDy, maxVisibleDy));
            } else {
              dy = rawDy;
            }

            scale = Math.max(0.78, Math.min(0.96, Number((targetRect.width / cardRect.width).toFixed(2))));
          }
        }
      }

      setFlyCoords({ dx, dy, scale });
      setIsFlyingOut(true);
      onFlyToConsole?.();

      setTimeout(() => {
        setIsFlyingOut(false);
        setFlyCoords(null);
        onComplete();
      }, 520);
    },
    [isFlyingOut, onFlyToConsole]
  );

  if (!isOpen && !isFlyingOut) return null;

  const isDark = colorMode !== 'light';
  const eloStd = eloStandard || 1200;
  const eloJq = eloJieqi || 1200;
  const tierStd = getRankTier(eloStd, isDark);
  const tierJq = getRankTier(eloJq, isDark);

  const statsStd = statsStandard || {
    elo: eloStd,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0
  };

  const statsJq = statsJieqi || {
    elo: eloJq,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none transition-all duration-500 ${
        isFlyingOut
          ? 'bg-black/0 backdrop-blur-none pointer-events-none'
          : 'bg-black/65 backdrop-blur-xs animate-in fade-in duration-200'
      }`}
      onClick={() => triggerFlyToConsole(onClose)}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={
          isFlyingOut && flyCoords
            ? {
                transform: `translate3d(${flyCoords.dx}px, ${flyCoords.dy}px, 0) scale(${flyCoords.scale})`,
                opacity: 0,
                transition:
                  'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out 340ms, box-shadow 520ms ease',
                pointerEvents: 'none'
              }
            : {
                transform: 'translate3d(0px, 0px, 0px) scale(1)',
                opacity: 1
              }
        }
        className={`relative w-full max-w-[420px] sm:max-w-[440px] rounded-2xl border shadow-2xl backdrop-blur-md flex flex-col overflow-hidden ${
          !isFlyingOut ? 'animate-in zoom-in-95 duration-200' : 'ring-2 ring-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)]'
        } ${
          isDark
            ? 'bg-[#151923]/98 border-[#342718] text-neutral-100 shadow-black/80 ring-1 ring-amber-500/20'
            : 'bg-[#faf6ee]/98 border-[#d6cbba] text-neutral-900 shadow-stone-500/40 ring-1 ring-amber-700/15'
        }`}
      >
        {/* Header */}
        <div
          className={`px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 gap-2 ${
            isDark
              ? 'border-[#2a2218] bg-gradient-to-r from-[#171b26] to-[#141720]'
              : 'border-[#dfd3c3] bg-gradient-to-r from-[#fbf7f0] to-[#f4ebe0]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                isDark
                  ? 'bg-gradient-to-r from-[#2a241b] to-[#362c1d] text-amber-300 border-amber-500/30'
                  : 'bg-white text-amber-950 border-amber-700/20 shadow-xs'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2
                className={`text-sm font-serif font-bold tracking-wide leading-tight ${
                  isDark ? 'text-amber-300' : 'text-amber-950'
                }`}
              >
                Chọn Chế Độ Chơi
              </h2>
              <p className={`text-[10px] leading-tight ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Thiết lập chế độ và thể loại cờ trước khi vào ván
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerFlyToConsole(onClose)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'border-[#302517] bg-[#1a1f2b] text-neutral-300 hover:bg-[#23293a] hover:text-white'
                : 'border-[#cfc2ae] bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-3.5 flex flex-col gap-2.5 max-h-[82vh] overflow-y-auto">
          {/* 1. CHẾ ĐỘ ĐẤU ĐỐI KHÁNG & ĐỘ KHÓ AI */}
          <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-serif font-bold uppercase tracking-wider leading-normal py-0.5 ${
                  isDark ? 'text-amber-400' : 'text-amber-900'
                }`}
              >
                Chế độ đấu đối kháng
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Nút 1: Đấu Trực Tuyến */}
              <button
                type="button"
                onClick={() => {
                  triggerFlyToConsole(() => {
                    onClose();
                    onChangeGameMode('online');
                  });
                }}
                className={`py-2.5 px-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center leading-normal shadow-xs active:scale-98 ${
                  gameMode === 'online'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400 shadow-sm'
                    : isDark
                    ? 'border-[#2d3548] bg-black/30 text-neutral-200 hover:bg-white/5 hover:text-white'
                    : 'border-[#cfc2ae] bg-white text-neutral-900 hover:bg-neutral-50 shadow-xs'
                }`}
              >
                <span className="text-base sm:text-lg shrink-0">🌐</span>
                <span className="truncate py-1 leading-normal">Đấu Trực Tuyến</span>
              </button>

              {/* Nút 2: Đấu 2 người (local) */}
              <button
                type="button"
                onClick={() => onChangeGameMode('pvp')}
                className={`py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center leading-normal shadow-xs active:scale-98 ${
                  gameMode === 'pvp'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400 shadow-sm'
                    : isDark
                    ? 'border-[#2d3548] bg-black/30 text-neutral-200 hover:bg-white/5 hover:text-white'
                    : 'border-[#cfc2ae] bg-white text-neutral-900 hover:bg-neutral-50 shadow-xs'
                }`}
              >
                <span className="text-base sm:text-lg shrink-0">👥</span>
                <span className="flex flex-col items-center justify-center py-0.5">
                  <span className="leading-snug">Đấu 2 người</span>
                  <span className="text-[10px] font-medium leading-none opacity-85">(local)</span>
                </span>
              </button>

              {/* Nút 3: Đấu Với Máy */}
              <button
                type="button"
                onClick={() => {
                  const randomSide = Math.random() < 0.5 ? 'pve-red' : 'pve-black';
                  onChangeGameMode(randomSide);
                }}
                className={`col-span-2 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-1.5 leading-normal shadow-xs active:scale-98 ${
                  gameMode?.startsWith('pve')
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400 shadow-sm'
                    : isDark
                    ? 'border-[#2d3548] bg-black/25 text-neutral-300 hover:bg-white/5 hover:text-white'
                    : 'border-[#cfc2ae] bg-white text-neutral-900 hover:bg-neutral-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm shrink-0">🤖</span>
                  <span className="truncate py-1 leading-normal">Đấu với máy</span>
                </div>
                {gameMode?.startsWith('pve') ? (
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-black/20 text-amber-200 border border-white/20 shrink-0 leading-normal">
                    {gameMode === 'pve-red' ? 'Cầm Đỏ 🔴' : 'Cầm Đen ⚫'}
                  </span>
                ) : (
                  <span className="text-[10px] font-normal opacity-70 shrink-0 leading-normal py-0.5">
                    Đỏ / Đen ngẫu nhiên
                  </span>
                )}
              </button>
            </div>

            {/* Độ khó máy AI - Chỉ hiển thị khi chọn chế độ đấu với máy */}
            {gameMode?.startsWith('pve') && (
              <div className="pt-0.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={`font-serif font-bold uppercase tracking-wider leading-normal py-0.5 ${
                      isDark ? 'text-amber-400' : 'text-amber-900'
                    }`}
                  >
                    Chọn mức độ AI:
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'easy' as const, label: 'Nhập môn', desc: 'Dành cho người mới tập chơi (Dễ)' },
                    { id: 'medium' as const, label: 'Cơ bản', desc: 'Phong trào cơ bản (Vừa)' },
                    { id: 'hard' as const, label: 'Cao thủ', desc: 'Trình độ cao thủ (Khó)' },
                    { id: 'master' as const, label: 'Kiện Tướng', desc: 'Cực hạn Kiện Tướng (Cao)' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onChangeDifficulty(d.id)}
                      className={`py-1.5 px-0.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center leading-normal ${
                        difficulty === d.id
                          ? 'bg-amber-500 text-black border-amber-400 shadow-xs font-bold'
                          : isDark
                          ? 'border-[#2d3548] bg-black/25 text-neutral-300 hover:bg-white/5 font-semibold'
                          : 'border-[#cfc2ae] bg-white text-neutral-800 hover:bg-neutral-50 shadow-xs font-semibold'
                      }`}
                      title={d.desc}
                    >
                      <span className="text-[10.5px] sm:text-[11px] leading-normal py-0.5 truncate px-0.5">
                        {d.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. BẢNG XẾP HẠNG & ĐIỂM ELO (CỜ NGỬA & CỜ ÚP) */}
          <div
            className={`p-2 rounded-xl border transition-all flex flex-col gap-1.5 shrink-0 ${
              isDark
                ? 'bg-gradient-to-b from-[#161a24]/95 via-[#12151e]/98 to-[#0d0f17] border-[#382b1b] shadow-inner ring-1 ring-amber-500/10'
                : 'bg-gradient-to-b from-[#fdfbf7] via-[#f7efe2] to-[#efe2cf] border-[#d8c9b0] shadow-xs ring-1 ring-amber-700/10'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-1 border-b shrink-0 ${
                isDark ? 'border-amber-500/15' : 'border-amber-800/15'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className={`p-0.5 rounded border shadow-xs shrink-0 ${
                    isDark
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-amber-100 text-amber-800 border-amber-600/20'
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                </div>
                <h3
                  className={`text-xs font-serif font-bold uppercase tracking-wider leading-normal py-0.5 truncate ${
                    isDark ? 'text-amber-400' : 'text-amber-900'
                  }`}
                >
                  Elo Xếp Hạng & Thể Loại Cờ
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* THẺ 1: CỜ NGỬA */}
              <div
                onClick={() => onChangeVariant('standard')}
                className={`p-1.5 rounded-lg border transition-all flex flex-col gap-1 relative overflow-hidden cursor-pointer ${
                  variant === 'standard'
                    ? isDark
                      ? 'border-amber-500/80 bg-gradient-to-br from-[#241c14]/90 to-[#120f0c] shadow-xs ring-1 ring-amber-500/30'
                      : 'border-amber-600/80 bg-gradient-to-br from-[#fffdfa] to-[#f6ebd6] shadow-xs ring-1 ring-amber-600/30'
                    : isDark
                    ? 'border-[#382b1b]/80 bg-black/25 opacity-85 hover:opacity-100 hover:border-amber-500/40'
                    : 'border-[#dfd3c3] bg-white/70 opacity-85 hover:opacity-100 hover:border-amber-600/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-serif font-bold flex items-center gap-1 ${
                      isDark ? 'text-amber-400' : 'text-amber-800'
                    }`}
                  >
                    <Swords className={`w-3 h-3 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                    <span>Cờ Ngửa</span>
                  </span>
                  {variant === 'standard' ? (
                    <span
                      className={`text-[8px] font-black px-1 py-0.2 rounded uppercase tracking-wide shadow-xs ${
                        isDark ? 'bg-amber-500 text-black' : 'bg-amber-600 text-white'
                      }`}
                    >
                      Ván Này
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeVariant('standard');
                      }}
                      className={`text-[8px] font-bold px-1 py-0.2 rounded border transition-all cursor-pointer ${
                        isDark
                          ? 'border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                          : 'border-amber-700/40 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Chọn đấu
                    </button>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span
                      className={`text-base sm:text-lg font-black font-mono leading-none ${
                        isDark ? 'text-amber-300' : 'text-amber-900'
                      }`}
                    >
                      {eloStd}
                    </span>
                    <span
                      className={`text-[9px] font-sans ml-0.5 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-700 font-bold'
                      }`}
                    >
                      Elo
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-bold px-1 py-0.2 rounded border flex items-center gap-0.5 ${tierStd.colorClass}`}
                  >
                    <span>{tierStd.badge}</span>
                    <span>{tierStd.tier}</span>
                  </span>
                </div>

                <div
                  className={`pt-0.5 border-t text-[9px] flex items-center justify-between font-semibold ${
                    isDark ? 'border-white/5 text-neutral-400' : 'border-amber-900/10 text-neutral-800'
                  }`}
                >
                  <span>{statsStd.games} trận</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {statsStd.wins}T-{statsStd.draws}H-{statsStd.losses}B
                  </span>
                  <span className={`font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                    ({statsStd.winRate}%)
                  </span>
                </div>
              </div>

              {/* THẺ 2: CỜ ÚP */}
              <div
                onClick={() => onChangeVariant('jieqi')}
                className={`p-1.5 rounded-lg border transition-all flex flex-col gap-1 relative overflow-hidden cursor-pointer ${
                  variant === 'jieqi'
                    ? isDark
                      ? 'border-red-500/80 bg-gradient-to-br from-[#271316]/90 to-[#12080a] shadow-xs ring-1 ring-red-500/30'
                      : 'border-red-600/80 bg-gradient-to-br from-[#fffafa] to-[#f9dede] shadow-xs ring-1 ring-red-600/30'
                    : isDark
                    ? 'border-[#3a1d21]/80 bg-black/25 opacity-85 hover:opacity-100 hover:border-red-500/40'
                    : 'border-[#dfd3c3] bg-white/70 opacity-85 hover:opacity-100 hover:border-red-600/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-serif font-bold flex items-center gap-1 ${
                      isDark ? 'text-red-400' : 'text-red-800'
                    }`}
                  >
                    <Drama className={`w-3 h-3 shrink-0 ${isDark ? 'text-rose-400' : 'text-red-600'}`} />
                    <span>Cờ Úp</span>
                  </span>
                  {variant === 'jieqi' ? (
                    <span className="text-[8px] font-black px-1 py-0.2 rounded bg-red-600 text-white uppercase tracking-wide shadow-xs">
                      Ván Này
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeVariant('jieqi');
                      }}
                      className={`text-[8px] font-bold px-1 py-0.2 rounded border transition-all cursor-pointer ${
                        isDark
                          ? 'border-red-500/40 text-red-300 hover:bg-red-500/20'
                          : 'border-red-700/40 text-red-800 hover:bg-red-100'
                      }`}
                    >
                      Chọn đấu
                    </button>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span
                      className={`text-base sm:text-lg font-black font-mono leading-none ${
                        isDark ? 'text-red-300' : 'text-red-900'
                      }`}
                    >
                      {eloJq}
                    </span>
                    <span
                      className={`text-[9px] font-sans ml-0.5 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-700 font-bold'
                      }`}
                    >
                      Elo
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-bold px-1 py-0.2 rounded border flex items-center gap-0.5 ${tierJq.colorClass}`}
                  >
                    <span>{tierJq.badge}</span>
                    <span>{tierJq.tier}</span>
                  </span>
                </div>

                <div
                  className={`pt-0.5 border-t text-[9px] flex items-center justify-between font-semibold ${
                    isDark ? 'border-white/5 text-neutral-400' : 'border-red-900/10 text-neutral-800'
                  }`}
                >
                  <span>{statsJq.games} trận</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {statsJq.wins}T-{statsJq.draws}H-{statsJq.losses}B
                  </span>
                  <span className={`font-bold font-mono ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                    ({statsJq.winRate}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div
              className={`flex items-center justify-between pt-1 border-t text-[10px] shrink-0 ${
                isDark ? 'border-amber-500/15' : 'border-amber-800/15'
              }`}
            >
              <span
                className={`text-[9px] font-medium leading-normal py-0.5 truncate ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Hệ số xếp hạng Elo
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerFlyToConsole(() => {
                        onClose();
                        onOpenProfile();
                      });
                    }}
                    className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 ${
                      isDark
                        ? 'border-[#362a1b] text-amber-300 hover:bg-white/5'
                        : 'border-[#cfc2ae] text-amber-800 hover:bg-black/5'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Hồ sơ</span>
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerFlyToConsole(() => {
                        onClose();
                        onOpenLeaderboard();
                      });
                    }}
                    className="px-2 py-0.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>BXH</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. NÚT BẮT ĐẦU VÀO VÁN */}
          <button
            type="button"
            onClick={() => {
              if (!gameMode) {
                onStartGame();
                return;
              }
              triggerFlyToConsole(onStartGame);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-serif font-bold text-sm shadow-lg shadow-amber-900/30 border border-amber-400/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Bắt Đầu Vào Ván</span>
          </button>
        </div>
      </div>
    </div>
  );
});

StartGameMenuModal.displayName = 'StartGameMenuModal';
