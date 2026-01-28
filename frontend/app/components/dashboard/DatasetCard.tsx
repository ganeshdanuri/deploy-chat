import { Database, Trash2, FileText, Calendar } from "lucide-react";
import { theme } from "../../theme";

interface DatasetCardProps {
  id: string;
  name: string;
  items: number;
  created: string;
  onDelete: (id: string) => void;
  onManage?: (id: string) => void;
}

export default function DatasetCard({ 
  id, 
  name, 
  items, 
  created, 
  onDelete,
  onManage 
}: DatasetCardProps) {
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
              background: `linear-gradient(135deg, ${theme.colors.accent.purple}, #6d28d9)`
            }}
          >
            <Database className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 
              className="font-semibold text-base"
              style={{ color: theme.colors.neutral[900] }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <FileText className="w-3.5 h-3.5" style={{ color: theme.colors.neutral[500] }} />
              <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>{items} documents</p>
            </div>
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

      <div className="mb-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: theme.colors.neutral[500] }} />
            <span className="text-sm" style={{ color: theme.colors.neutral[600] }}>Created</span>
          </div>
          <span className="text-sm font-medium" style={{ color: theme.colors.neutral[900] }}>{created}</span>
        </div>
      </div>

      <button 
        onClick={() => onManage?.(id)}
        className="w-full px-4 py-2.5 rounded-lg transition-all text-sm font-medium text-white hover:-translate-y-0.5 hover:shadow-md"
        style={{ 
          background: theme.gradients.primaryButton,
          boxShadow: theme.shadows.sm
        }}
      >
        Manage Documents
      </button>
    </div>
  );
}
