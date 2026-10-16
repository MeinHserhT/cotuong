'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Clock, ShieldAlert, Eye } from 'lucide-react';
import { BoardTheme, getRankTier } from '@/lib/xiangqi-types';

export interface PlayerBlockProps {
  isActive: boolean;
  isRed: boolean;
  avatarChar: string;
  title: string;
  badgeLabel: string;
  capturedPieces: string[];
  timer: number;
  timeLimit: number;
  formatSec: (s: number) => string;
  elo?: number;
  theme?: BoardTheme;
  isTimerRunning?: boolean;
  turnTimer?: number;
  moveTimeLimit?: number;
  isCheck?: boolean;
  gameMode?: 'pve-red' | 'pve-black' | 'pvp' | 'online';
  otherPlayerName?: string;
  isInspecting?: boolean;
  inspectMoveIndex?: number | null;
  onExitInspect?: () => void;
  opponentDisconnected?: boolean;
  opponentGraceSeconds?: number;
  colorMode?: 'dark' | 'light';
}

export function PlayerBlock({
  isActive,
  isRed,
  avatarChar,
  title,
  badgeLabel,
  timer,
  timeLimit,
  formatSec,
  elo,
  theme = 'imperial',
  isTimerRunning = true,
  turnTimer,
  moveTimeLimit = 60,
  isCheck = false,
  gameMode,
  otherPlayerName,
  isInspecting = false,
  inspectMoveIndex = null,
  onExitInspect,
  opponentDisconnected = false,
  opponentGraceSeconds = 30,
  colorMode = 'dark',
}: PlayerBlockProps) {
  const isDark = colorMode !== 'light';
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 220, h: 56 });

  useEffect(() => {
    if (!cardRef.current) return;
    const updateDims = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDims({ w: rect.width, h: rect.height });
        }
      }
    };
    updateDims();
    const ro = new ResizeObserver(updateDims);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const r = 12;
  const width = Math.max(20, dims.w - 2);
  const height = Math.max(20, dims.h - 2);
  const perimeter = Math.max(10, 2 * (width + height) - 8 * r + 2 * Math.PI * r);
  const progress = timeLimit > 0 ? Math.max(0, Math.min(1, timer / timeLimit)) : 1;
  const strokeOffset = perimeter * (1 - progress);
  const isUrgent = isActive && timer <= 10 && timeLimit > 0;
  const rank = elo ? getRankTier(elo) : null;

  const isZen = theme === 'zen';

  return (
    <div
      ref={cardRef}
      className={`relative w-full rounded-xl flex flex-col transition-all duration-300 min-h-[50px] sm:min-h-[56px] overflow-hidden ${
        isDark
          ? isActive && isCheck
            ? 'bg-gradient-to-r from-[#321319] via-[#24171d] to-[#1a1217] shadow-[0_0_25px_rgba(239,68,68,0.5)] border-2 border-red-500 ring-1 ring-red-400/80 animate-pulse text-neutral-100'
            : isActive
            ? isRed
              ? isZen
                ? 'bg-gradient-to-r from-[#262422] via-[#1f1d1b] to-[#181615] shadow-[0_0_20px_rgba(217,119,6,0.2)] border border-amber-600/70 text-neutral-100'
                : 'bg-gradient-to-r from-[#24171d] via-[#1c202d] to-[#191d29] shadow-[0_0_20px_rgba(239,68,68,0.25)] border border-red-500/70 text-neutral-100'
              : isZen
              ? 'bg-gradient-to-r from-[#242624] via-[#1c1e1c] to-[#161816] shadow-[0_0_20px_rgba(100,116,139,0.2)] border border-slate-500/70 text-neutral-100'
              : 'bg-gradient-to-r from-[#232018] via-[#1c202d] to-[#191d29] shadow-[0_0_20px_rgba(245,158,11,0.25)] border border-amber-500/70 text-neutral-100'
            : isZen
            ? 'bg-[#181a17]/85 opacity-75 border border-[#2b302a] text-neutral-100'
            : 'bg-[#141722]/85 opacity-75 border border-[#262e40] text-neutral-100'
          : isActive && isCheck
          ? 'bg-gradient-to-r from-red-100 via-rose-50 to-red-100 shadow-[0_0_20px_rgba(239,68,68,0.35)] border-2 border-red-600 ring-1 ring-red-400 animate-pulse text-neutral-900'
          : isActive
          ? isRed
            ? 'bg-gradient-to-r from-[#fef2f2] via-[#faf5eb] to-[#fff7ed] shadow-[0_0_15px_rgba(239,68,68,0.2)] border-2 border-red-500 text-neutral-900'
            : 'bg-gradient-to-r from-[#fefce8] via-[#faf5eb] to-[#f8fafc] shadow-[0_0_15px_rgba(245,158,11,0.2)] border-2 border-amber-600 text-neutral-900'
          : 'bg-[#faf5eb]/95 opacity-90 border border-[#d8cdbd] shadow-sm text-neutral-900'
      }`}
    >
      {/* Inspection Header Strip (when reviewing match moves) */}
      {isInspecting && typeof inspectMoveIndex === 'number' && (
        <div className="w-full px-3 py-1 bg-amber-950/90 border-b border-amber-500/40 flex items-center justify-between text-xs text-amber-200 z-30 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Đang xem lại nước thứ <strong>{inspectMoveIndex + 1}</strong></span>
          </div>
          {onExitInspect && (
            <button
              type="button"
              onClick={onExitInspect}
              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] transition-all cursor-pointer shadow-xs"
            >
              Về nước hiện tại
            </button>
          )}
        </div>
      )}

      {/* Opponent Disconnected Header Strip (Online mode) */}
      {opponentDisconnected && (
        <div className="w-full px-3 py-1 bg-red-950/95 border-b border-red-500/40 flex items-center justify-between text-xs text-red-200 animate-pulse z-30 shrink-0">
          <span className="font-semibold text-[11px] flex items-center gap-1">
            <span>⚠️</span>
            <span>Đối thủ mất mạng · Chờ kết nối lại ({opponentGraceSeconds}s)</span>
          </span>
        </div>
      )}
      {/* Running Timer Border Overlay (SVG) */}
      {isActive && isTimerRunning && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none rounded-xl overflow-visible z-20"
          style={{ width: dims.w, height: dims.h }}
        >
          <defs>
            <linearGradient id={`timer-grad-${isRed ? 'red' : 'black'}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {isRed ? (
                <>
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </>
              )}
            </linearGradient>
            <filter id={`timer-glow-${isRed ? 'red' : 'black'}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect
            x="1"
            y="1"
            width={width}
            height={height}
            rx={r}
            ry={r}
            fill="none"
            stroke={isRed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)'}
            strokeWidth="2.5"
          />
          <rect
            x="1"
            y="1"
            width={width}
            height={height}
            rx={r}
            ry={r}
            fill="none"
            stroke={isUrgent ? '#ef4444' : `url(#timer-grad-${isRed ? 'red' : 'black'})`}
            strokeWidth={isUrgent ? '3.5' : '2.5'}
            strokeDasharray={perimeter}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            filter={`url(#timer-glow-${isRed ? 'red' : 'black'})`}
          />
          <rect
            x="1"
            y="1"
            width={width}
            height={height}
            rx={r}
            ry={r}
            fill="none"
            stroke={isRed ? '#fca5a5' : '#fef08a'}
            strokeWidth="2.5"
            strokeDasharray="40 240"
            strokeLinecap="round"
            className="timer-running-beam opacity-80"
          />
        </svg>
      )}

      {/* Main Player Row */}
      <div className="w-full px-2.5 py-1.5 sm:py-2 flex items-center justify-between gap-2 relative z-10 min-w-0">
        {/* Left: Avatar, Name & Turn Status */}
        <div className="flex items-center gap-2 relative z-10 min-w-0 flex-1">
          <div
            className={`relative w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-inner border transition-all shrink-0 ${
              isRed
                ? isZen
                  ? 'bg-gradient-to-br from-[#f5ede0] via-[#e2c7a2] to-[#ab824e] border-[#7d481f] text-[#b91c1c]'
                  : 'bg-gradient-to-br from-[#fff3dc] via-[#deaa6a] to-[#a86c2f] border-[#8e2b1b] text-[#b71c1c]'
                : isZen
                ? 'bg-gradient-to-br from-[#f1f5f9] via-[#cbd5e1] to-[#64748b] border-[#334155] text-[#0f172a]'
                : 'bg-gradient-to-br from-[#f1e2c9] via-[#cfa068] to-[#885929] border-[#222] text-[#1a1a1a]'
            } ${
              isActive && isCheck
                ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.85)] animate-pulse'
                : isActive
                ? isRed
                  ? 'ring-1.5 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'ring-1.5 ring-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : ''
            }`}
          >
            <span className="font-piece font-bold" style={{ fontFamily: '"Iansui", "Ma Shan Zheng", "Zhi Mang Xing", "LXGW WenKai TC", "STKaiti", "KaiTi", "Kaiti SC", "BiauKai", "DFKai-SB", "ZCOOL XiaoWei", "Noto Serif SC", cursive, serif' }}>
              {avatarChar || (isRed ? '帥' : '將')}
            </span>
            {isActive && (
              <span
                className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#191d27] ${
                  isCheck
                    ? 'bg-red-500 animate-ping'
                    : isRed
                    ? 'bg-red-400 animate-ping'
                    : 'bg-amber-400 animate-ping'
                }`}
              />
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 w-full min-w-0 flex-wrap">
              <h3 className={`text-sm sm:text-base font-bold leading-normal py-0.5 truncate max-w-[200px] sm:max-w-none ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`} title={title}>
                {title}
              </h3>
              {badgeLabel && badgeLabel !== title && (
                <span className={`text-[11px] sm:text-xs px-1.5 py-0.5 rounded font-mono shrink-0 font-semibold ${
                  isDark ? 'bg-[#293245] text-neutral-300' : 'bg-[#e2d5c1] text-neutral-800'
                }`}>
                  {badgeLabel}
                </span>
              )}
              {rank && elo ? (
                <div className={`flex items-center gap-1 text-xs font-mono leading-none shrink-0 ${
                  isDark ? 'text-amber-300/90' : 'text-amber-800'
                }`}>
                  <span>{rank.badge}</span>
                  <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{elo}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-0.5 flex items-center min-w-0">
              {isActive ? (
                isCheck ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-tight leading-tight bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white border border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.85)] animate-pulse truncate shrink-0">
                    <ShieldAlert className="w-3 h-3 text-yellow-300 animate-bounce shrink-0" />
                    <span className="truncate text-[10px] sm:text-[11px] leading-tight">Đang bị chiếu tướng!</span>
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-normal leading-tight border shadow-xs animate-pulse truncate ${
                      isDark
                        ? isRed
                          ? 'bg-red-950/90 text-red-300 border-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                          : 'bg-amber-950/90 text-amber-300 border-amber-500/70 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        : isRed
                        ? 'bg-red-100 text-red-800 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                        : 'bg-amber-100 text-amber-900 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isRed ? 'bg-red-500 animate-ping' : 'bg-amber-500 animate-ping'
                      }`}
                    />
                    <span className="truncate text-[10px] sm:text-[11px] leading-tight">
                      Đến lượt
                    </span>
                  </span>
                )
              ) : (
                <span className={`text-[10px] sm:text-[11px] leading-tight px-1.5 sm:px-2 py-0.5 rounded-full border truncate font-medium ${
                  isDark
                    ? 'text-neutral-300 bg-neutral-800/60 border-neutral-700/50'
                    : 'text-neutral-800 font-semibold bg-neutral-200/90 border-neutral-300 shadow-2xs'
                }`}>
                  Đợi lượt
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Prominent Digital Game Clock & 60s Turn Countdown */}
        <div className="relative z-10 shrink-0 flex items-center gap-1.5 sm:gap-2">
          {/* Nước đi 60s đếm ngược (Turn Timer) */}
          {isActive && typeof turnTimer === 'number' && (
            <div
              className={`inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                !isTimerRunning
                  ? isDark
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    : 'bg-white border-neutral-300 text-neutral-800'
                  : turnTimer <= 10
                  ? isDark
                    ? 'bg-red-950 text-red-300 border-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                    : 'bg-red-100 text-red-700 border-red-500 animate-pulse shadow-xs'
                  : turnTimer <= 20
                  ? isDark
                    ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'bg-amber-100 text-amber-800 border-amber-500 shadow-xs'
                  : isDark
                  ? isRed
                    ? 'bg-red-950/80 text-red-200 border-red-500/50'
                    : 'bg-amber-950/80 text-amber-200 border-amber-500/50'
                  : isRed
                  ? 'bg-white text-red-700 border-red-300 shadow-xs'
                  : 'bg-white text-amber-900 border-amber-300 shadow-xs'
              }`}
              title={`Thời gian nước đi này: còn ${turnTimer}s / ${moveTimeLimit}s`}
            >
              <span className="text-xs sm:text-sm">⏱️</span>
              <span>{turnTimer}s</span>
            </div>
          )}

          {/* Tổng thời gian trận đấu (15 phút) */}
          <div
            className={`inline-flex items-center gap-1.5 font-mono text-sm sm:text-base md:text-lg font-black px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
              isActive
                ? isUrgent
                  ? isDark
                    ? 'bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse'
                    : 'bg-red-100 border-red-500 text-red-700 shadow-xs animate-pulse'
                  : isDark
                  ? isRed
                    ? 'bg-[#15121b] border-red-500/60 text-red-300 shadow-xs'
                    : 'bg-[#14151b] border-amber-500/60 text-amber-300 shadow-xs'
                  : isRed
                  ? 'bg-white border-red-400 text-red-700 shadow-xs'
                  : 'bg-white border-amber-500 text-amber-900 shadow-xs'
                : isDark
                ? 'bg-[#0d1017] border-[#222938] text-neutral-400'
                : 'bg-white border-[#cfc1ac] text-neutral-900 font-black shadow-xs'
            }`}
            title={!isTimerRunning ? 'Thời gian sẽ bắt đầu tính sau khi bạn đi nước cờ đầu tiên' : 'Tổng thời gian trận đấu (15 phút)'}
          >
            <Clock
              className={`w-3.5 h-3.5 shrink-0 ${
                isActive && isTimerRunning
                  ? isUrgent
                    ? 'text-red-500 animate-spin'
                    : isRed
                    ? 'text-red-500'
                    : isDark
                    ? 'text-amber-400'
                    : 'text-amber-600'
                  : isDark
                  ? 'text-neutral-400'
                  : 'text-neutral-500'
              }`}
              style={isUrgent ? { animationDuration: '2s' } : undefined}
            />
            <span>{timeLimit > 0 ? formatSec(timer) : '∞'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
