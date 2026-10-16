'use client';

import React, { useState } from 'react';
import {
  FileText,
  SlidersHorizontal,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Flag,
  Handshake,
  Swords,
  PlusCircle,
  LogOut,
  Clock,
  Sparkles,
  Settings2,
  Copy,
  Check,
  ChevronDown,
  Volume2,
  VolumeX,
  Compass,
  Trophy,
  TrendingUp,
  Flame,
  Drama,
  User
} from 'lucide-react';
import { BotDifficulty, BoardTheme, MoveRecord, MoveNotation, getRankTier } from '@/lib/xiangqi-types';
import { ChatMessage } from '@/lib/multiplayer-types';

export interface VariantEloStats {
  elo: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface UnifiedGameConsoleProps {
  // Variant
  variant?: 'standard' | 'jieqi';
  onChangeVariant?: (variant: 'standard' | 'jieqi') => void;

  // Dual Elo & Statistics
  eloStandard?: number;
  eloJieqi?: number;
  statsStandard?: VariantEloStats;
  statsJieqi?: VariantEloStats;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;

  // Game Mode & Actions
  gameMode: 'pve-red' | 'pve-black' | 'pvp' | 'online' | null;
  onChangeGameMode: (mode: 'pve-red' | 'pve-black' | 'pvp' | 'online') => void;
  difficulty: BotDifficulty;
  onChangeDifficulty: (diff: BotDifficulty) => void;
  timeLimit: number;
  onChangeTimeLimit: (limit: number) => void;
  autoFlip: boolean;
  onToggleAutoFlip: (checked: boolean) => void;
  onUndo: () => void;
  canUndo: boolean;
  onResign: () => void;
  canResign: boolean;
  onNewGame: () => void;

  // Online specifics
  isOnlineGame: boolean;
  isGameOver: boolean;
  drawOfferedByOpponent?: boolean;
  onOfferDraw?: () => void;
  onAcceptDraw?: () => void;
  onLeaveRoom?: () => void;
  onRequestRematch?: () => void;
  rematchRequestedByOpponent?: boolean;
  myRematchRequested?: boolean;
  onCreateOnlineRoom?: () => void;

  // Moves & ScoreSheet
  moveHistory: MoveRecord[];
  inspectMoveIndex: number | null;
  onSelectMove: (index: number) => void;
  onExitInspect: () => void;
  theme?: BoardTheme;
  fenString: string;
  onCopyFen: () => void;
  copiedFen: boolean;

  // In-Game Chat (online mode)
  chatMessages?: ChatMessage[];
  onSendMessage?: (text: string, isQuick?: boolean) => void;
  spectatorCount?: number;
  isSpectator?: boolean;

  // UI & Theme
  colorMode?: 'dark' | 'light';
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isHiddenBeforeDock?: boolean;
}

export function UnifiedGameConsole({
  variant = 'standard',
  onChangeVariant,
  eloStandard = 1200,
  eloJieqi = 1200,
  statsStandard,
  statsJieqi,
  onOpenProfile,
  onOpenLeaderboard,
  gameMode,
  onChangeGameMode,
  difficulty,
  onChangeDifficulty,
  timeLimit,
  onChangeTimeLimit,
  autoFlip,
  onToggleAutoFlip,
  onUndo,
  canUndo,
  onResign,
  canResign,
  onNewGame,
  isOnlineGame,
  isGameOver,
  drawOfferedByOpponent,
  onOfferDraw,
  onAcceptDraw,
  onLeaveRoom,
  onRequestRematch,
  rematchRequestedByOpponent = false,
  myRematchRequested = false,
  onCreateOnlineRoom,
  moveHistory,
  inspectMoveIndex,
  onSelectMove,
  onExitInspect,
  fenString,
  onCopyFen,
  copiedFen,
  chatMessages = [],
  onSendMessage,
  spectatorCount = 0,
  isSpectator = false,
  colorMode = 'dark',
  isCollapsed = false,
  onToggleCollapse,
  isHiddenBeforeDock = false
}: UnifiedGameConsoleProps) {
  const isDark = colorMode !== 'light';
  const [activeTab, setActiveTab] = useState<'moves' | 'controls' | 'chat'>('controls');
  const [notationMode, setNotationMode] = useState<'full' | 'short'>('full');
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Paired moves for notation table
  const pairedMoves: { index: number; red?: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairedMoves.push({
      index: Math.floor(i / 2) + 1,
      red: moveHistory[i],
      black: moveHistory[i + 1]
    });
  }

  const currentIndex = inspectMoveIndex !== null ? inspectMoveIndex : moveHistory.length - 1;

  // Dual Elo calculations for Cờ Ngửa & Cờ Úp
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

  const handleSendChat = (e?: React.FormEvent) => {
    e?.preventDefault();
    const txt = chatInput.trim();
    if (!txt || !onSendMessage) return;
    onSendMessage(txt, false);
    setChatInput('');
  };

  // If collapsed: Render elegant lacquered vertical quick rail
  if (isCollapsed) {
    return (
      <div
        className={`w-11 sm:w-12 h-full min-h-[480px] rounded-2xl border flex flex-col items-center justify-start gap-4 py-3 px-1 transition-all shadow-xl backdrop-blur-md select-none shrink-0 ${
          isDark
            ? 'bg-[#151923]/95 border-[#322617] text-neutral-200 shadow-black/60'
            : 'bg-[#faf6ee]/95 border-[#d8cbba] text-neutral-800 shadow-stone-300/40'
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isDark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-black/5 text-amber-800'
          }`}
          title="Mở rộng bảng điều khiển"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('moves');
              onToggleCollapse?.();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'moves'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'bg-amber-100 text-amber-950 font-bold shadow-xs'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-700 hover:text-neutral-950 font-medium'
            }`}
            title="Biên bản ván đấu"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTab('controls');
              onToggleCollapse?.();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'controls'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'bg-amber-100 text-amber-950 font-bold shadow-xs'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-700 hover:text-neutral-950 font-medium'
            }`}
            title="Thao tác & Cài đặt"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {isOnlineGame && (
            <button
              onClick={() => {
                setActiveTab('chat');
                onToggleCollapse?.();
              }}
              className={`p-2 rounded-xl relative transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'bg-amber-100 text-amber-950 font-bold shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200'
                  : 'text-neutral-700 hover:text-neutral-950 font-medium'
              }`}
              title="Trò chuyện"
            >
              <MessageSquare className="w-4 h-4" />
              {chatMessages.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-[440px] lg:max-w-[460px] xl:max-w-[480px] mx-auto rounded-2xl border shadow-xl backdrop-blur-md flex flex-col h-auto transition-all duration-300 select-none overflow-hidden ${
        isHiddenBeforeDock
          ? 'opacity-0 invisible pointer-events-none scale-95'
          : 'opacity-100 visible scale-100'
      } ${
        isDark
          ? 'bg-[#151923]/95 border-[#342718] text-neutral-100 shadow-black/50 ring-1 ring-amber-500/15'
          : 'bg-[#faf6ee]/95 border-[#d6cbba] text-neutral-900 shadow-stone-300/40 ring-1 ring-amber-700/10'
      }`}
    >
      {/* 1. Oriental Header with Segmented Navigation & Collapse Trigger */}
      <div
        className={`px-3 py-2 sm:py-2.5 border-b flex items-center justify-between shrink-0 gap-2 ${
          isDark
            ? 'border-[#2a2218] bg-gradient-to-r from-[#171b26] to-[#141720]'
            : 'border-[#dfd3c3] bg-gradient-to-r from-[#fbf7f0] to-[#f4ebe0]'
        }`}
      >
        {/* Segmented Control Pill Bar */}
        <div
          className={`flex items-center p-0.5 rounded-xl border text-sm font-bold ${
            isDark ? 'bg-black/40 border-[#302517]' : 'bg-[#eae0d1] border-[#cebfa9]'
          }`}
        >
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'controls'
                ? isDark
                  ? 'bg-gradient-to-r from-[#2a241b] to-[#362c1d] text-amber-300 font-bold shadow-xs border border-amber-500/30'
                  : 'bg-white text-amber-950 font-bold shadow-xs border border-amber-700/20'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-700 hover:text-neutral-950 font-medium'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Điều khiển</span>
          </button>

          <button
            onClick={() => setActiveTab('moves')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'moves'
                ? isDark
                  ? 'bg-gradient-to-r from-[#2a241b] to-[#362c1d] text-amber-300 font-bold shadow-xs border border-amber-500/30'
                  : 'bg-white text-amber-950 font-bold shadow-xs border border-amber-700/20'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-700 hover:text-neutral-950 font-medium'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Biên bản</span>
          </button>

          {isOnlineGame && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? isDark
                    ? 'bg-gradient-to-r from-[#2a241b] to-[#362c1d] text-amber-300 font-bold shadow-xs border border-amber-500/30'
                    : 'bg-white text-amber-950 font-bold shadow-xs border border-amber-700/20'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200'
                  : 'text-neutral-700 hover:text-neutral-950 font-medium'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          )}
        </div>

        {/* Right Tools: Collapse */}
        <div className="flex items-center gap-1">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer hidden lg:flex items-center justify-center ${
                isDark
                  ? 'border-[#302517] bg-[#1a1f2b] text-neutral-300 hover:bg-[#23293a]'
                  : 'border-[#cfc2ae] bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
              title="Thu gọn bảng điều khiển để tập trung bàn cờ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Consolidated Settings Popover Drawer (Overlay when active) */}
      {showSettingsPopover && (
        <div
          className={`absolute top-11 right-2 left-2 z-40 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? 'bg-[#181d28]/98 border-amber-500/40 text-neutral-100 shadow-black/80'
              : 'bg-[#faf4e8]/98 border-amber-700/40 text-neutral-900 shadow-stone-400/50'
          }`}
        >
          <div className={`flex items-center justify-between pb-2 mb-2.5 border-b ${
            isDark ? 'border-amber-500/20' : 'border-amber-800/20'
          }`}>
            <span className={`text-xs font-serif font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-amber-400' : 'text-amber-900'
            }`}>
              <Compass className="w-3.5 h-3.5" />
              <span>Thiết lập ván đấu & Biến thể</span>
            </span>
            <button
              onClick={() => setShowSettingsPopover(false)}
              className={`text-xs font-bold px-1.5 py-0.5 rounded transition-colors ${
                isDark ? 'text-neutral-400 hover:text-neutral-100 hover:bg-white/10' : 'text-neutral-700 hover:text-neutral-950 hover:bg-black/10'
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Biến thể cờ */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${
                isDark ? 'text-amber-400' : 'text-amber-950'
              }`}>
                Biến thể cờ
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeVariant?.('standard')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    variant === 'standard'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-xs'
                      : isDark
                      ? 'border-[#2d3548] text-neutral-300 hover:bg-white/5'
                      : 'border-[#cfc2ae] text-neutral-800 hover:bg-black/5 bg-white font-semibold'
                  }`}
                >
                  ⚔️ Cờ Ngửa
                </button>
                <button
                  type="button"
                  onClick={() => onChangeVariant?.('jieqi')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    variant === 'jieqi'
                      ? 'bg-red-600 text-white border-red-400 shadow-xs'
                      : isDark
                      ? 'border-[#2d3548] text-neutral-300 hover:bg-white/5'
                      : 'border-[#cfc2ae] text-neutral-800 hover:bg-black/5 bg-white font-semibold'
                  }`}
                >
                  🎭 Cờ Úp
                </button>
              </div>
            </div>

            {/* Thời gian trận đấu */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${
                isDark ? 'text-amber-400' : 'text-amber-950'
              }`}>
                Thời gian mỗi bên
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: 'Không', value: 0 },
                  { label: '5 phút', value: 300 },
                  { label: '10 phút', value: 600 },
                  { label: '15 phút', value: 900 }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => onChangeTimeLimit(item.value)}
                    className={`py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                      timeLimit === item.value
                        ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-xs'
                        : isDark
                        ? 'border-[#2d3548] text-neutral-300 hover:bg-white/5'
                        : 'border-[#cfc2ae] text-neutral-800 hover:bg-black/5 bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tự động xoay bàn cờ (Pass & Play) */}
            {gameMode === 'pvp' && (
              <label className="flex items-center justify-between cursor-pointer pt-1">
                <span className={isDark ? "text-neutral-300" : "text-neutral-900 font-bold"}>Tự động xoay bàn theo lượt</span>
                <input
                  type="checkbox"
                  checked={autoFlip}
                  onChange={(e) => onToggleAutoFlip(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* 3. Primary Action Bar (Compact & Prominent) */}
      <div
        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 border-b shrink-0 ${
          isOnlineGame
            ? 'flex items-center justify-between gap-2'
            : 'grid grid-cols-3 gap-1.5 sm:gap-2'
        } ${
          isDark ? 'border-[#2a2218] bg-black/20' : 'border-[#dfd3c3] bg-amber-50/50'
        }`}
      >
        {isOnlineGame ? (
          <>
            {drawOfferedByOpponent ? (
              <button
                onClick={onAcceptDraw}
                className="flex-1 py-1.5 sm:py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer animate-pulse flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-4 h-4" /> Đồng ý hòa
              </button>
            ) : (
              <button
                onClick={onOfferDraw}
                disabled={isGameOver}
                className={`flex-1 py-1.5 sm:py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'border-[#302517] bg-[#1a1f2b] text-neutral-200 hover:bg-[#23293a]'
                    : 'border-[#cfc2ae] bg-white text-neutral-800 hover:bg-neutral-100 shadow-xs'
                }`}
              >
                <Handshake className="w-4 h-4 text-amber-500" /> Cầu hòa
              </button>
            )}

            <button
              onClick={onResign}
              disabled={!canResign}
              className={`flex-1 py-1.5 sm:py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                isDark
                  ? 'border-red-900/60 bg-red-950/40 text-red-300 hover:bg-red-900/50'
                  : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 shadow-xs'
              }`}
            >
              <Flag className="w-4 h-4 text-red-500" /> Xin thua
            </button>

            {isGameOver && (
              <button
                onClick={onRequestRematch}
                disabled={myRematchRequested}
                className="flex-1 py-1.5 sm:py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 leading-normal"
              >
                <Swords className="w-4 h-4 shrink-0" />
                <span className="truncate py-0.5 leading-normal">{rematchRequestedByOpponent ? 'Chấp nhận đấu lại' : 'Đấu lại'}</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`w-full py-1.5 sm:py-2 px-1 rounded-xl border text-xs font-bold disabled:opacity-40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs leading-normal ${
                isDark
                  ? 'border-[#302517] bg-[#1a1f2b] text-neutral-200 hover:bg-[#23293a]'
                  : 'border-[#cfc2ae] bg-white text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate py-0.5 leading-normal">Hoãn nước</span>
            </button>

            <button
              onClick={onResign}
              disabled={!canResign}
              className={`w-full py-1.5 sm:py-2 px-1 rounded-xl border text-xs font-bold disabled:opacity-40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs leading-normal ${
                isDark
                  ? 'border-red-900/60 bg-red-950/40 text-red-300 hover:bg-red-900/50'
                  : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate py-0.5 leading-normal">Xin thua</span>
            </button>

            <button
              onClick={onNewGame}
              className="w-full py-1.5 sm:py-2 px-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 leading-normal"
            >
              <Swords className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate py-0.5 leading-normal">Ván mới</span>
            </button>
          </>
        )}
      </div>

      {/* 4. Tab Body Area - Fits inner content snuggly */}
      <div className="flex-initial h-auto flex flex-col p-2 sm:p-2.5 overflow-hidden">
        {/* TAB 1: BIÊN BẢN & NƯỚC ĐI */}
        {activeTab === 'moves' && (
          <div className="flex flex-col space-y-2">
            {/* Move Notations & Quick FEN bar */}
            <div className="flex items-center justify-between text-xs font-bold pt-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-serif font-bold uppercase tracking-wider ${isDark ? 'text-amber-500/90' : 'text-amber-800'}`}>
                  Lịch sử ({moveHistory.length} nước)
                </span>
                {inspectMoveIndex !== null && (
                  <button
                    onClick={onExitInspect}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono hover:bg-amber-500 hover:text-black cursor-pointer"
                  >
                    Nước hiện tại ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <div
                  className={`flex items-center rounded-md p-0.5 text-[9px] border ${
                    isDark ? 'bg-black/30 border-[#302517]' : 'bg-[#ede3d4] border-[#cfc1ac]'
                  }`}
                >
                  <button
                    onClick={() => setNotationMode('full')}
                    className={`px-1.5 py-0.2 rounded font-semibold transition-all cursor-pointer ${
                      notationMode === 'full'
                        ? isDark ? 'bg-amber-500 text-black font-bold' : 'bg-white text-amber-950 font-bold shadow-xs'
                        : isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-700 hover:text-neutral-950'
                    }`}
                  >
                    Đầy đủ
                  </button>
                  <button
                    onClick={() => setNotationMode('short')}
                    className={`px-1.5 py-0.2 rounded font-semibold transition-all cursor-pointer ${
                      notationMode === 'short'
                        ? isDark ? 'bg-amber-500 text-black font-bold' : 'bg-white text-amber-950 font-bold shadow-xs'
                        : isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-700 hover:text-neutral-950'
                    }`}
                  >
                    Ngắn
                  </button>
                </div>

                <button
                  onClick={onCopyFen}
                  className={`p-1 rounded border transition-all cursor-pointer ${
                    isDark
                      ? 'border-[#302517] bg-[#1a1f2b] text-neutral-300 hover:bg-[#23293a]'
                      : 'border-[#cfc2ae] bg-white text-neutral-800 hover:bg-neutral-100'
                  }`}
                  title="Sao chép FEN"
                >
                  {copiedFen ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-amber-500" />}
                </button>
              </div>
            </div>

            {/* Scrollable Notation Table */}
            <div
              className={`h-[300px] sm:h-[340px] overflow-y-auto rounded-xl border p-1 font-mono text-xs divide-y scrollbar-thin ${
                isDark
                  ? 'bg-black/30 border-[#2a2218] divide-white/5'
                  : 'bg-white/80 border-[#dcd1c0] divide-black/5'
              }`}
            >
              {pairedMoves.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-3 text-center">
                  <div
                    className={`w-full max-w-[280px] p-2.5 rounded-xl border flex items-center gap-2.5 mb-2 transition-all shadow-xs ${
                      variant === 'jieqi'
                        ? isDark
                          ? 'bg-red-950/20 border-red-500/30 text-red-200'
                          : 'bg-red-50/80 border-red-300 text-red-900'
                        : isDark
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-amber-50/80 border-amber-300 text-amber-900'
                    }`}
                  >
                    <span className="text-xl shrink-0">{variant === 'jieqi' ? '🎭' : '⚔️'}</span>
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">
                          {variant === 'jieqi' ? 'Ván Đấu Cờ Úp' : 'Ván Đấu Cờ Ngửa'}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          variant === 'jieqi' ? tierJq.colorClass : tierStd.colorClass
                        }`}>
                          {variant === 'jieqi' ? tierJq.badge : tierStd.badge} {variant === 'jieqi' ? tierJq.tier : tierStd.tier}
                        </span>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Điểm Elo tính ván này: <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{variant === 'jieqi' ? eloJq : eloStd}</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-[11px] italic ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Chưa có nước đi nào. Hãy bắt đầu ván đấu bằng cách chọn quân cờ trên bàn!
                  </p>
                </div>
              ) : (
                pairedMoves.map((pair) => {
                  const redIdx = (pair.index - 1) * 2;
                  const blackIdx = redIdx + 1;
                  const isRedActive = currentIndex === redIdx;
                  const isBlackActive = currentIndex === blackIdx;

                  return (
                    <div key={pair.index} className="flex items-center py-1 px-1.5 hover:bg-amber-500/10">
                      <span className={`w-8 shrink-0 text-[11px] font-sans ${isDark ? 'text-neutral-400 font-medium' : 'text-neutral-700 font-bold'}`}>
                        {pair.index}.
                      </span>

                      {/* Red Move */}
                      <button
                        onClick={() => onSelectMove(redIdx)}
                        className={`flex-1 text-left px-1.5 py-0.5 rounded transition-all cursor-pointer truncate ${
                          isRedActive
                            ? isDark
                              ? 'bg-red-600/30 text-red-300 font-bold border border-red-500/40'
                              : 'bg-red-100 text-red-900 font-black border border-red-400 shadow-xs'
                            : isDark
                            ? 'text-red-400 hover:bg-white/5 font-medium'
                            : 'text-red-700 hover:bg-red-50 font-bold'
                        }`}
                      >
                        {pair.red ? (notationMode === 'full' ? pair.red.notation.vn : pair.red.notation.vnShort) : '-'}
                      </button>

                      {/* Black Move */}
                      <button
                        onClick={() => pair.black && onSelectMove(blackIdx)}
                        disabled={!pair.black}
                        className={`flex-1 text-left px-1.5 py-0.5 rounded transition-all truncate ${
                          pair.black
                            ? isBlackActive
                              ? isDark
                                ? 'bg-slate-700/50 text-amber-300 font-bold border border-amber-400/40 cursor-pointer'
                                : 'bg-neutral-200 text-neutral-950 font-black border border-neutral-400 shadow-xs cursor-pointer'
                              : isDark
                              ? 'text-neutral-300 hover:bg-white/5 cursor-pointer font-medium'
                              : 'text-neutral-900 hover:bg-neutral-100 cursor-pointer font-bold'
                            : isDark
                            ? 'text-neutral-600'
                            : 'text-neutral-400'
                        }`}
                      >
                        {pair.black
                          ? notationMode === 'full'
                            ? pair.black.notation.vn
                            : pair.black.notation.vnShort
                          : ''}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ĐIỀU KHIỂN & CHỌN CHẾ ĐỘ CHƠI */}
        {activeTab === 'controls' && (
          <div className="flex flex-col gap-2 select-none">
            {/* 1. CHẾ ĐỘ ĐẤU ĐỐI KHÁNG & ĐỘ KHÓ AI (Ẩn khi đang trong phòng đấu trực tuyến) */}
            {!isOnlineGame ? (
              <div className="space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-serif font-bold uppercase tracking-wider leading-normal py-0.5 ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                    Chế độ đấu đối kháng
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Nút 1: Đấu Trực Tuyến */}
                  <button
                    type="button"
                    onClick={() => onChangeGameMode('online')}
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

                  {/* Nút 3: Đấu Với Máy (Chọn bên ngẫu nhiên) - Chuyển xuống dưới, chiếm 2 cột */}
                  <button
                    type="button"
                    onClick={() => {
                      const randomSide = Math.random() < 0.5 ? 'pve-red' : 'pve-black';
                      onChangeGameMode(randomSide as any);
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

                {/* Độ khó máy AI khi chơi PvE - Chỉ hiển thị khi chọn chế độ đấu với máy */}
                {gameMode?.startsWith('pve') && (
                  <div className="pt-0.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-serif font-bold uppercase tracking-wider leading-normal py-0.5 ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
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
            ) : (
              /* Quick Link to Online Lobby / Room actions */
              <div
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 shrink-0 ${
                  isDark ? 'bg-black/30 border-[#302517]' : 'bg-white border-[#cfc2ae] shadow-xs'
                }`}
              >
                <div className="min-w-0 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="truncate">
                    <div className={`text-xs font-bold leading-tight ${isDark ? 'text-amber-400' : 'text-amber-950'}`}>
                      Phòng trực tuyến
                    </div>
                    {spectatorCount > 0 && (
                      <div className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Khán giả: {spectatorCount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  {onCreateOnlineRoom && (
                    <button
                      onClick={onCreateOnlineRoom}
                      className="py-1 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Tạo phòng
                    </button>
                  )}
                  {onLeaveRoom && (
                    <button
                      onClick={onLeaveRoom}
                      className={`py-1 px-2 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                        isDark ? 'border-[#302517] text-neutral-300 hover:bg-white/5' : 'border-[#cfc2ae] text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Rời phòng
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2. BẢNG XẾP HẠNG & ĐIỂM ELO (CỜ NGỬA & CỜ ÚP) - THU GỌN TINH TẾ, KHÔNG KÉO DÀI */}
            <div
              className={`p-2 rounded-xl border transition-all flex flex-col gap-1.5 shrink-0 ${
                isDark
                  ? 'bg-gradient-to-b from-[#161a24]/95 via-[#12151e]/98 to-[#0d0f17] border-[#382b1b] shadow-inner ring-1 ring-amber-500/10'
                  : 'bg-gradient-to-b from-[#fdfbf7] via-[#f7efe2] to-[#efe2cf] border-[#d8c9b0] shadow-xs ring-1 ring-amber-700/10'
              }`}
            >
              {/* Header: Title + Mode Indicator */}
              <div className={`flex items-center justify-between pb-1 border-b shrink-0 ${
                isDark ? 'border-amber-500/15' : 'border-amber-800/15'
              }`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`p-0.5 rounded border shadow-xs shrink-0 ${isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-600/20'}`}>
                    <Trophy className="w-3 h-3" />
                  </div>
                  <h3 className={`text-xs font-serif font-bold uppercase tracking-wider leading-normal py-0.5 truncate ${
                    isDark ? 'text-amber-400' : 'text-amber-900'
                  }`}>
                    Elo Xếp Hạng & Thể Loại Cờ
                  </h3>
                </div>
              </div>

              {/* Hai thẻ Elo riêng biệt: Cờ Ngửa & Cờ Úp (Thu gọn gàng, hiển thị đầy đủ thông tin) */}
              <div className="grid grid-cols-2 gap-1.5">
                {/* THẺ 1: CỜ NGỬA */}
                <div
                  onClick={() => onChangeVariant?.('standard')}
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
                  {/* Card Title & Variant Button */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-serif font-bold flex items-center gap-1 ${
                      isDark ? 'text-amber-400' : 'text-amber-800'
                    }`}>
                      <Swords className={`w-3 h-3 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                      <span>Cờ Ngửa</span>
                    </span>
                    {variant === 'standard' ? (
                      <span className={`text-[8px] font-black px-1 py-0.2 rounded uppercase tracking-wide shadow-xs ${
                        isDark ? 'bg-amber-500 text-black' : 'bg-amber-600 text-white'
                      }`}>
                        Ván Này
                      </span>
                    ) : onChangeVariant ? (
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
                    ) : null}
                  </div>

                  {/* Elo Score & Tier Badge */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className={`text-base sm:text-lg font-black font-mono leading-none ${
                        isDark ? 'text-amber-300' : 'text-amber-900'
                      }`}>
                        {eloStd}
                      </span>
                      <span className={`text-[9px] font-sans ml-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-700 font-bold'}`}>Elo</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded border flex items-center gap-0.5 ${tierStd.colorClass}`}>
                      <span>{tierStd.badge}</span>
                      <span>{tierStd.tier}</span>
                    </span>
                  </div>

                  {/* Stats summary */}
                  <div className={`pt-0.5 border-t text-[9px] flex items-center justify-between font-semibold ${
                    isDark ? 'border-white/5 text-neutral-400' : 'border-amber-900/10 text-neutral-800'
                  }`}>
                    <span>{statsStd.games} trận</span>
                    <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{statsStd.wins}T-{statsStd.draws}H-{statsStd.losses}B</span>
                    <span className={`font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>({statsStd.winRate}%)</span>
                  </div>
                </div>

                {/* THẺ 2: CỜ ÚP */}
                <div
                  onClick={() => onChangeVariant?.('jieqi')}
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
                  {/* Card Title & Variant Button */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-serif font-bold flex items-center gap-1 ${
                      isDark ? 'text-red-400' : 'text-red-800'
                    }`}>
                      <Drama className={`w-3 h-3 shrink-0 ${isDark ? 'text-rose-400' : 'text-red-600'}`} />
                      <span>Cờ Úp</span>
                    </span>
                    {variant === 'jieqi' ? (
                      <span className="text-[8px] font-black px-1 py-0.2 rounded bg-red-600 text-white uppercase tracking-wide shadow-xs">
                        Ván Này
                      </span>
                    ) : onChangeVariant ? (
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
                    ) : null}
                  </div>

                  {/* Elo Score & Tier Badge */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className={`text-base sm:text-lg font-black font-mono leading-none ${
                        isDark ? 'text-red-300' : 'text-red-900'
                      }`}>
                        {eloJq}
                      </span>
                      <span className={`text-[9px] font-sans ml-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-700 font-bold'}`}>Elo</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded border flex items-center gap-0.5 ${tierJq.colorClass}`}>
                      <span>{tierJq.badge}</span>
                      <span>{tierJq.tier}</span>
                    </span>
                  </div>

                  {/* Stats summary */}
                  <div className={`pt-0.5 border-t text-[9px] flex items-center justify-between font-semibold ${
                    isDark ? 'border-white/5 text-neutral-400' : 'border-red-900/10 text-neutral-800'
                  }`}>
                    <span>{statsJq.games} trận</span>
                    <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{statsJq.wins}T-{statsJq.draws}H-{statsJq.losses}B</span>
                    <span className={`font-bold font-mono ${isDark ? 'text-red-300' : 'text-red-900'}`}>({statsJq.winRate}%)</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer - Gọn gàng, vừa vặn không choán chỗ */}
              <div className={`flex items-center justify-between pt-1 border-t text-[10px] shrink-0 ${
                isDark ? 'border-amber-500/15' : 'border-amber-800/15'
              }`}>
                <span className={`text-[9px] font-medium leading-normal py-0.5 truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Hệ số xếp hạng Elo
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {onOpenProfile && (
                    <button
                      type="button"
                      onClick={onOpenProfile}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 ${
                        isDark ? 'border-[#362a1b] text-amber-300 hover:bg-white/5' : 'border-[#cfc2ae] text-amber-800 hover:bg-black/5'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      <span>Hồ sơ</span>
                    </button>
                  )}
                  {onOpenLeaderboard && (
                    <button
                      type="button"
                      onClick={onOpenLeaderboard}
                      className="px-2 py-0.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <Trophy className="w-3 h-3" />
                      <span>BXH</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHAT TRỰC TUYẾN (KHI CHƠI ONLINE) */}
        {activeTab === 'chat' && isOnlineGame && (
          <div className="flex flex-col space-y-2">
            <div
              className={`h-[280px] sm:h-[320px] overflow-y-auto rounded-xl border p-2 space-y-2 text-xs scrollbar-thin ${
                isDark ? 'bg-black/30 border-[#2a2218]' : 'bg-white/80 border-[#dcd1c0]'
              }`}
            >
              {chatMessages.length === 0 ? (
                <div className={`h-full flex items-center justify-center text-xs italic text-center p-3 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-700 font-medium'
                }`}>
                  Chưa có tin nhắn trong phòng. Hãy gửi lời chào đến đối thủ!
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className="flex flex-col text-xs">
                    <span className={`font-bold text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>{msg.senderName}</span>
                    <span className={isDark ? "text-neutral-100" : "text-neutral-950 font-medium"}>{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className={`flex-1 px-2.5 py-1.5 rounded-xl border text-xs outline-none ${
                  isDark
                    ? 'bg-black/40 border-[#302517] text-neutral-100 placeholder-neutral-500'
                    : 'bg-white border-[#cfc2ae] text-neutral-900 placeholder-neutral-400'
                }`}
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs transition-all cursor-pointer"
              >
                Gửi
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
