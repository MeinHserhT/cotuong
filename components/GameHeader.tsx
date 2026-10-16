'use client';

import React from 'react';
import {
  Menu,
  UserCircle2,
  Share2,
  Check,
  BookOpen,
  User as UserIcon,
  Flame,
  Swords
} from 'lucide-react';
import { BoardTheme, getRankTier } from '@/lib/xiangqi-types';
import { User } from 'firebase/auth';
import { DayNightSwitch } from '@/components/ui/DayNightSwitch';

interface GameHeaderProps {
  variant?: 'standard' | 'jieqi';
  onToggleVariant?: () => void;
  theme?: BoardTheme;
  colorMode?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onToggleColorMode?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onFlipBoard?: () => void;
  onShareRoom: () => void;
  copiedShareLink: boolean;
  onOpenOpeningBook: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileDrawer: () => void;
  onOpenOnlineLobby: () => void;
  onOpenMenu: () => void;
  user: User | null;
  userElo?: number;
  userName?: string;
  isOnlineGame?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(({
  variant = 'standard',
  onToggleVariant,
  theme,
  colorMode = 'dark',
  onToggleTheme,
  onToggleColorMode,
  isMuted,
  onToggleMute,
  onFlipBoard,
  onShareRoom,
  copiedShareLink,
  onOpenOpeningBook,
  onOpenAuthModal,
  onOpenProfileDrawer,
  onOpenOnlineLobby,
  onOpenMenu,
  user,
  userElo = 1200,
  userName,
  isOnlineGame
}) => {
  const rankTier = getRankTier(userElo);
  const isDark = colorMode === 'dark';

  return (
    <header
      className={`relative w-full max-w-5xl mx-auto mb-3 flex items-center justify-between gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl border shadow-xl backdrop-blur-md transition-colors overflow-hidden ${
        isDark
          ? 'bg-[#151a24]/92 border-[#2b354b] text-neutral-100'
          : 'bg-[#faf6ee]/95 border-[#d6cbba] text-neutral-900 shadow-stone-300/40'
      }`}
    >
      {/* Brand logo & title */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-[#171a22] rounded-[10px] flex items-center justify-center">
            <span className="font-piece font-bold text-amber-400 text-base sm:text-xl" style={{ fontFamily: '"Iansui", "Ma Shan Zheng", "Zhi Mang Xing", "LXGW WenKai TC", "STKaiti", "KaiTi", "Kaiti SC", "BiauKai", "DFKai-SB", "ZCOOL XiaoWei", "Noto Serif SC", cursive, serif' }}>將</span>
          </div>
        </div>
        <div className="min-w-0 hidden md:block overflow-hidden">
          <h1
            className={`font-heading font-bold text-sm lg:text-lg tracking-wide truncate flex items-center gap-1.5 ${
              isDark ? 'text-amber-200' : 'text-amber-900'
            }`}
          >
            <span className="truncate">Cờ Tướng Online</span>
            <span className="text-[11px] font-sans font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/40 hidden lg:inline-block shrink-0">
              Live
            </span>
          </h1>
          <p className={`text-xs truncate hidden lg:block ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Trí tuệ dân gian · Đấu trí đỉnh cao
          </p>
        </div>
      </div>

      {/* Action buttons & Utilities: Cờ Úp / Cờ Sáng, Phòng Đấu, Giao diện Sáng/Tối, Đăng nhập & Menu */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink-0">
        {/* NÚT PHÒNG ĐẤU TRỰC TUYẾN - HIỆN RÕ CHỮ PHÒNG ĐẤU */}
        <button
          onClick={onOpenOnlineLobby}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-xs shrink-0 ${
            isDark
              ? 'bg-gradient-to-r from-red-950/80 via-[#271d2c] to-[#1c2333] hover:from-red-900/90 hover:to-[#263148] border-red-500/50 text-red-100 ring-1 ring-red-500/20'
              : 'bg-white hover:bg-red-50/90 border-red-400 text-red-700 shadow-xs'
          }`}
          title="Phòng Đấu Trực Tuyến & Ghép Cặp"
        >
          <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
          <span className="font-bold tracking-wide whitespace-nowrap">Phòng Đấu</span>
        </button>

        {/* NÚT GIAO DIỆN SÁNG / TỐI (DAY / NIGHT SWITCH) - SÁT NÚT PHÒNG ĐẤU Ở BÊN TRÁI */}
        <div className="flex items-center justify-center shrink-0">
          <DayNightSwitch
            isDark={isDark}
            onToggle={onToggleColorMode || (() => {})}
            size="sm"
          />
        </div>
        {/* Share Room Button (in online mode) */}
        {isOnlineGame && (
          <button
            onClick={onShareRoom}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isDark
                ? 'bg-[#202737] hover:bg-[#2b3449] border-[#34405a] text-neutral-300'
                : 'bg-white hover:bg-neutral-100 border-[#d8cfbe] text-neutral-700'
            }`}
            title="Sao chép link mời phòng"
          >
            {copiedShareLink ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4 text-sky-500" />
            )}
          </button>
        )}

        {/* NÚT ĐĂNG NHẬP / HỒ SƠ NGƯỜI CHƠI TRỰC QUAN */}
        {user ? (
          <button
            onClick={onOpenProfileDrawer}
            className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-sm shrink-0 ${
              isDark
                ? 'bg-gradient-to-r from-[#21293a] to-[#2b354b] hover:from-[#2a3449] border-amber-500/40 text-neutral-100'
                : 'bg-white hover:bg-amber-50/50 border-amber-500/40 text-neutral-900'
            }`}
            title="Xem hồ sơ & Lịch sử ván đấu"
          >
            <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/50 shrink-0">
              {userName?.charAt(0).toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left hidden md:block py-0.5">
              <div
                className={`text-xs sm:text-sm font-bold leading-normal pt-0.5 pb-0.5 truncate max-w-[110px] lg:max-w-[160px] ${
                  isDark ? 'text-amber-200' : 'text-amber-900'
                }`}
              >
                {userName || 'Kỳ Thủ'}
              </div>
              <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-mono flex items-center gap-0.5 leading-normal">
                <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{userElo} · {rankTier.tier}</span>
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/25 border border-amber-400/40 transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            title="Đăng nhập để lưu điểm Elo và bảng xếp hạng"
          >
            <UserCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="font-bold tracking-wide">Đăng nhập</span>
          </button>
        )}

        {/* NÚT MENU TỐI GIẢN (3 GẠCH) */}
        <button
          onClick={onOpenMenu}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs shrink-0 ${
            isDark
              ? 'bg-[#202737] hover:bg-[#2b3449] border-[#34405a] text-amber-300 hover:text-amber-200'
              : 'bg-white hover:bg-neutral-100 border-[#d8cfbe] text-neutral-800'
          }`}
          title="Menu cài đặt"
          aria-label="Menu cài đặt"
        >
          <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
});

GameHeader.displayName = 'GameHeader';
