import { theme } from "../../theme";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ icon, label, value, bgColor, iconColor, trend }: StatCardProps) {
  return (
    <div 
      className="bg-white rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ 
        borderColor: theme.colors.neutral[200],
        boxShadow: theme.shadows.sm
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <div>
            <p 
              className="text-sm font-medium mb-1"
              style={{ color: theme.colors.neutral[600] }}
            >
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <p 
                className="text-2xl font-semibold"
                style={{ color: theme.colors.neutral[900] }}
              >
                {value}
              </p>
              {trend && (
                <span 
                  className="text-xs font-medium flex items-center gap-0.5"
                  style={{ 
                    color: trend.isPositive ? theme.colors.accent.green : "#ef4444"
                  }}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
