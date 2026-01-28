import { Plus, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../theme";

interface DashboardHeaderProps {
  onCreateDataset: () => void;
  onCreateChatbot: () => void;
}

export default function DashboardHeader({ onCreateDataset, onCreateChatbot }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div 
      className="bg-white border-b w-full"
      style={{ 
        borderColor: theme.colors.neutral[200],
        boxShadow: theme.shadows.sm
      }}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-semibold"
              style={{ color: theme.colors.neutral[900] }}
            >
              Dashboard
            </h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: theme.colors.neutral[600] }}
            >
              Welcome back, <span className="font-medium" style={{ color: theme.colors.neutral[900] }}>{user?.username}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all font-medium text-sm hover:bg-gray-100"
              style={{ 
                borderColor: theme.colors.neutral[300], 
                color: theme.colors.neutral[700]
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onCreateDataset}
              className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all font-medium text-sm hover:bg-purple-50"
              style={{ 
                borderColor: theme.colors.accent.purple, 
                color: theme.colors.accent.purple,
                backgroundColor: 'white'
              }}
            >
              <Plus className="w-4 h-4" />
              New Dataset
            </button>
            <button
              onClick={onCreateChatbot}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all font-medium text-sm hover:-translate-y-0.5 hover:shadow-md"
              style={{ 
                background: theme.gradients.primaryButton,
                boxShadow: theme.shadows.sm
              }}
            >
              <Plus className="w-4 h-4" />
              New Chatbot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
