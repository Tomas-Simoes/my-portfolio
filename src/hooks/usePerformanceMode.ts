import { useEffect, useState } from 'react';

const PERFORMANCE_MODE_QUERY = '(max-width: 920px), (pointer: coarse), (hover: none)';

function getShouldUsePerformanceMode() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(PERFORMANCE_MODE_QUERY).matches;
}

export function usePerformanceMode() {
  const [isPerformanceMode, setIsPerformanceMode] = useState(getShouldUsePerformanceMode);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(PERFORMANCE_MODE_QUERY);
    const updatePerformanceMode = () => setIsPerformanceMode(mediaQuery.matches);

    updatePerformanceMode();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePerformanceMode);

      return () => mediaQuery.removeEventListener('change', updatePerformanceMode);
    }

    mediaQuery.addListener(updatePerformanceMode);

    return () => mediaQuery.removeListener(updatePerformanceMode);
  }, []);

  return isPerformanceMode;
}
