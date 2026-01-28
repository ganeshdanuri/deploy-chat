import { theme } from "../../theme";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div 
      className="text-center py-16 bg-white rounded-xl border-2 border-dashed"
      style={{ borderColor: theme.colors.neutral[300] }}
    >
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: theme.colors.neutral[100] }}
      >
        <div style={{ color: theme.colors.neutral[400] }}>
          {icon}
        </div>
      </div>
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: theme.colors.neutral[900] }}
      >
        {title}
      </h3>
      <p 
        className="mb-6 max-w-sm mx-auto"
        style={{ color: theme.colors.neutral[600] }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 text-white rounded-lg transition-all font-medium hover:-translate-y-0.5 hover:shadow-md"
          style={{ 
            background: theme.gradients.primaryButton,
            boxShadow: theme.shadows.sm
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
