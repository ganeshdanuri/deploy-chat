import { MessageSquare, Trash2, Settings, TrendingUp } from "lucide-react";
import { theme } from "../../theme";

interface ChatbotCardProps {
  id: string;
  name: string;
  dataset: string;
  status: string;
  conversations: number;
  onDelete: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export default function ChatbotCard({ 
  id, 
  name, 
  dataset, 
  status, 
  conversations, 
  onDelete,
  onConfigure 
}: ChatbotCardProps) {
  return (
    <div 
      className="bg-white rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ 
        borderColor: theme.colors.neutral[200],
        boxShadow: theme.shadows.sm
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark})`
            }}
          >
            <MessageSquare className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 
              className="font-semibold text-base"
              style={{ color: theme.colors.neutral[900] }}
            >
              {name}
            </h3>
            <span 
              className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: "#d1fae5",
                color: "#065f46",
                border: `1px solid ${theme.colors.accent.green}`
              }}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.colors.accent.green }}
              ></span>
              {status.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="p-2 rounded-lg transition-all hover:text-red-600 hover:bg-red-50"
          style={{ color: theme.colors.neutral[400] }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div 
          className="flex items-center justify-between py-2 border-b"
          style={{ borderColor: theme.colors.neutral[100] }}
        >
          <span className="text-sm" style={{ color: theme.colors.neutral[600] }}>Dataset</span>
          <span className="text-sm font-medium" style={{ color: theme.colors.neutral[900] }}>{dataset}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: theme.colors.neutral[500] }} />
            <span className="text-sm" style={{ color: theme.colors.neutral[600] }}>Conversations</span>
          </div>
          <span className="text-sm font-medium" style={{ color: theme.colors.neutral[900] }}>{conversations.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={() => onConfigure?.(id)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium text-white hover:-translate-y-0.5 hover:shadow-md"
        style={{ 
          background: theme.gradients.primaryButton,
          boxShadow: theme.shadows.sm
        }}
      >
        <Settings className="w-4 h-4" />
        Configure Bot
      </button>
    </div>
  );
}
