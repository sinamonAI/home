
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
  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      {/* 번개 글로우 필터 */}
      <filter id="boltGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* 차트 라인 */}
    <polyline points="4 17 8 11 12 14 16 6 20 10" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
    {/* 번개 — 밝은 인디고+글로우+플래시 */}
    <path
      d="M13 2L10 9h4l-3 7"
      stroke="#C7D2FE"
      strokeWidth="2"
      fill="none"
      filter="url(#boltGlow)"
      className="bolt-flash"
    />
  </svg>
);
