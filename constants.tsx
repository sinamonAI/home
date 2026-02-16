
import React from 'react';

export const COLORS = {
  bgStart: '#0A0A0F',
  bgEnd: '#0D0D1A',
  primary: '#6366F1',       // 인디고
  secondary: '#F59E0B',     // 암버
  accent: '#3B82F6',        // 블루
  textMuted: '#94A3B8'
};

export const SCRIPT_ID = '1-XYZ-SNAPQUANT-LIBRARY-ID-EXAMPLE';

export const BRAND_NAME = 'SnapQuant';

export const BRAND_LOGO = (
  <svg viewBox="0 0 28 24" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    {/* 번개(좌) + 우상향 차트(우) — 색상 분리 */}
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A5B4FC" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    {/* 번개 — 좌측, 인디고 그라데이션 */}
    <path d="M10 2L5.5 11H10L7 16" stroke="url(#boltGrad)" strokeWidth="2.2" fill="none" />
    {/* 우상향 차트선 — 우측, 인디고→앰버 그라데이션 */}
    <polyline points="11 18 15 13 18 15.5 22 8 25 10" stroke="url(#logoGrad)" strokeWidth="2.2" fill="none" />
    {/* 차트 끝 화살표 (상승 강조) */}
    <polyline points="23 7 25 10 22 10.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.8" />
  </svg>
);
