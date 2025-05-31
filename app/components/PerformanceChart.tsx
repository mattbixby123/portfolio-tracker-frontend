import { useMemo } from "react";

interface PerformanceChartProps {
  data: Record<string, any> | Array<Record<string, any>>;
  type?: 'bar' | 'line' | 'pie';
}

export default function PerformanceChart({ data, type = 'bar' }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: typeof value === 'number' ? value : parseFloat(value) || 0,
    }));
  }, [data]);

  const maxValue = Math.max(...chartData.map(item => item.value));

  if (type === 'pie') {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
    
    return (
      <div className="space-y-4">
        {chartData.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chartData.map((item) => (
        <div key={item.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{item.name}</span>
            <span className="font-medium text-gray-900">
              ${item.value.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}