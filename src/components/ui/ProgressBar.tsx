interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, showLabel = true, label = 'Progresso' }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border flex flex-col justify-center">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-brand-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
