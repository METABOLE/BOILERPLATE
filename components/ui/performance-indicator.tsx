import useClearSiteData from '@/hooks/useClearSiteData';
import { PERFORMANCE_LEVEL } from '@/hooks/usePerformance';
import { usePerformance } from '@/providers/performance.provider';
import clsx from 'clsx';

const PerformanceIndicator = () => {
  const { performanceLevel, executionTime } = usePerformance();
  const { clearSiteData } = useClearSiteData();

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
    <button
      className="fixed right-4 bottom-4 z-999 flex cursor-pointer items-center gap-2 rounded-full border border-slate-400/30 bg-slate-300/30 px-2 py-1 text-sm font-medium shadow-lg backdrop-blur-xl transition-all"
      title="Click to clear all site data and reload"
      onClick={handleClick}
    >
      <div
        className={clsx(
          'flex h-2 w-2 items-center gap-2 rounded-full',
          performanceLevel === PERFORMANCE_LEVEL.HIGH && 'bg-green-500',
          performanceLevel === PERFORMANCE_LEVEL.MEDIUM && 'bg-yellow-500',
          performanceLevel === PERFORMANCE_LEVEL.LOW && 'bg-red-500',
        )}
      />
      <div className="text-xs opacity-75">{executionTime.toFixed(1)}ms</div>
    </button>
  );
};

export default PerformanceIndicator;
