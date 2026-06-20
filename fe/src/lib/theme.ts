export type ThemeKey = 'red' | 'blue' | 'purple' | 'green' | 'orange' | 'pink';

export interface ThemePreset {
  name: string;
  emoji: string;
  primary: string;
  hover: string;
  light: string;
  ring: string;
  gradient: string;
}

export const THEME_PRESETS: Record<ThemeKey, ThemePreset> = {
  red: {
    name: 'Đỏ (Mặc định)',
    emoji: '🔴',
    primary: '#dc2626',
    hover: '#b91c1c',
    light: '#fef2f2',
    ring: 'rgba(220, 38, 38, 0.15)',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  },
  blue: {
    name: 'Xanh dương',
    emoji: '🔵',
    primary: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
    ring: 'rgba(37, 99, 235, 0.15)',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  },
  purple: {
    name: 'Tím',
    emoji: '🟣',
    primary: '#7c3aed',
    hover: '#6d28d9',
    light: '#f5f3ff',
    ring: 'rgba(124, 58, 237, 0.15)',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  },
  green: {
    name: 'Xanh lá',
    emoji: '🟢',
    primary: '#16a34a',
    hover: '#15803d',
    light: '#f0fdf4',
    ring: 'rgba(22, 163, 74, 0.15)',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  },
  orange: {
    name: 'Cam',
    emoji: '🟠',
    primary: '#ea580c',
    hover: '#c2410c',
    light: '#fff7ed',
    ring: 'rgba(234, 88, 12, 0.15)',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
  },
  pink: {
    name: 'Hồng',
    emoji: '🩷',
    primary: '#db2777',
    hover: '#be185d',
    light: '#fdf2f8',
    ring: 'rgba(219, 39, 119, 0.15)',
    gradient: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
  },
};

export const DEFAULT_THEME: ThemeKey = 'red';

export function getThemePreset(key: string): ThemePreset {
  return THEME_PRESETS[key as ThemeKey] ?? THEME_PRESETS[DEFAULT_THEME];
}

export function buildThemeStyle(preset: ThemePreset): Record<string, string> {
  return {
    '--primary': preset.primary,
    '--primary-hover': preset.hover,
    '--primary-light': preset.light,
    '--primary-ring': preset.ring,
    '--primary-gradient': preset.gradient,
  };
}
