'use client';

interface PerformanceChartProps {
  data: any;
  type?: 'line' | 'bar' | 'area';
}

export default function PerformanceChart({ data, type = 'line' }: PerformanceChartProps) {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-black/20 rounded-lg border border-white/5">
      <div className="text-xs text-gold/40 font-mono uppercase tracking-widest">
        {type.toUpperCase()} CHART: {Array.isArray(data) ? `${data.length} data points` : 'Ready'}
      </div>
    </div>
  );
}
