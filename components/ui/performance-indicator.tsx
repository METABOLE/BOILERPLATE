import useClearSiteData from '@/hooks/useClearSiteData';
import { PERFORMANCE_LEVEL } from '@/hooks/usePerformance';
import { usePerformance } from '@/providers/performance.provider';
import clsx from 'clsx';
import { useState } from 'react';

const getTimeRemaining = () => {
  try {
    const cached = localStorage.getItem('metabole_performance_metrics');
    if (!cached) return 'no cache';

    const parsed = JSON.parse(cached);
    const CACHE_DURATION = 30 * 60 * 1000;
    const age = Date.now() - parsed.timestamp;
    const remaining = CACHE_DURATION - age;

    if (remaining <= 0) return 'expired';

    const minutes = Math.floor(remaining / 60000);
    return `${minutes}min`;
  } catch {
    return 'error';
  }
};

const PerformanceIndicator = () => {
  const { performanceLevel, executionTime, score, isLoading } = usePerformance();
  const { clearSiteData } = useClearSiteData();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    if (
      window.confirm(
        '⚠️ Clear all site data and reload?\n\nThis will delete:\n• localStorage\n• sessionStorage\n• Cookies\n• IndexedDB\n• Cache Storage\n• Service Workers\n\nThe page will reload automatically.',
      )
    ) {
      await clearSiteData();
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-999">
      {isHovered && !isLoading && (
        <div className="absolute right-0 bottom-full mb-2 w-64 rounded-lg border border-slate-400/30 bg-slate-900/95 p-3 text-sm shadow-xl backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-semibold text-slate-200">Performance Metrics</span>
            <div
              className={clsx(
                'rounded-full px-2 py-0.5 text-xs font-bold',
                performanceLevel === PERFORMANCE_LEVEL.HIGH && 'bg-green-500/20 text-green-400',
                performanceLevel === PERFORMANCE_LEVEL.MEDIUM && 'bg-yellow-500/20 text-yellow-400',
                performanceLevel === PERFORMANCE_LEVEL.LOW && 'bg-red-500/20 text-red-400',
              )}
            >
              {performanceLevel.toUpperCase()}
            </div>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Animation Time:</span>
              <span className="font-mono font-semibold">{executionTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Score:</span>
              <span className="font-mono font-semibold">{score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cache expires in:</span>
              <span className="font-mono text-xs text-slate-400">{getTimeRemaining()}</span>
            </div>
          </div>
          <button
            className="mt-2 w-full border-t border-slate-700 pt-2 text-left text-xs text-slate-500"
            onClick={handleClick}
          >
            Click to clear cache & reload
          </button>
        </div>
      )}

      {/* Bouton indicateur */}
      <button
        className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-400/30 bg-slate-300/30 px-2 py-1 text-sm font-medium shadow-lg backdrop-blur-xl transition-all hover:scale-105"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={clsx(
            'flex h-2 w-2 items-center gap-2 rounded-full',
            performanceLevel === PERFORMANCE_LEVEL.HIGH && 'bg-green-500',
            performanceLevel === PERFORMANCE_LEVEL.MEDIUM && 'bg-yellow-500',
            performanceLevel === PERFORMANCE_LEVEL.LOW && 'bg-red-500',
          )}
        />
        <div className="text-xs opacity-75">{executionTime.toFixed(0)}ms</div>
      </button>
    </div>
  );
};

export default PerformanceIndicator;
