import type { CSSProperties } from 'react';
import type { ProjectTheme } from './data/projects';

export type LauncherThemeStyle = CSSProperties & {
  '--theme-accent': string;
  '--theme-accent-strong': string;
  '--theme-accent-rgb': string;
  '--theme-background': string;
  '--theme-background-rgb': string;
  '--theme-surface': string;
  '--theme-surface-rgb': string;
  '--theme-text-main': string;
  '--theme-text-muted': string;
  '--theme-text-rgb': string;
};

export type BackdropStyle = CSSProperties & {
  '--backdrop-accent-rgb': string;
  '--backdrop-background': string;
  '--backdrop-background-rgb': string;
  '--backdrop-surface-rgb': string;
};

export function createLauncherThemeStyle(theme: ProjectTheme): LauncherThemeStyle {
  return {
    '--theme-accent': theme.accent,
    '--theme-accent-strong': theme.accentStrong,
    '--theme-accent-rgb': theme.accentRgb,
    '--theme-background': theme.background,
    '--theme-background-rgb': theme.backgroundRgb,
    '--theme-surface': theme.surface,
    '--theme-surface-rgb': theme.surfaceRgb,
    '--theme-text-main': theme.textMain,
    '--theme-text-muted': theme.textMuted,
    '--theme-text-rgb': theme.textRgb,
  };
}

export function createBackdropStyle(theme: ProjectTheme): BackdropStyle {
  return {
    '--backdrop-accent-rgb': theme.accentRgb,
    '--backdrop-background': theme.background,
    '--backdrop-background-rgb': theme.backgroundRgb,
    '--backdrop-surface-rgb': theme.surfaceRgb,
  };
}
