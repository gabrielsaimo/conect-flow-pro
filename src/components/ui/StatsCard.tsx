interface StatsCardProps {
  label: string;
  value: number | string;
  color?: 'default' | 'green' | 'blue';
}

const colorStyles = {
  default: '',
  green: 'border-l-4 border-l-green-500',
  blue: 'border-l-4 border-l-blue-500',
};

const labelColors = {
  default: 'text-gray-500 dark:text-gray-400',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
};

export function StatsCard({ label, value, color = 'default' }: StatsCardProps) {
  return (
    <div className={`bg-white dark:bg-dark-card p-5 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border ${colorStyles[color]}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${labelColors[color]}`}>
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
    </div>
  );
}
