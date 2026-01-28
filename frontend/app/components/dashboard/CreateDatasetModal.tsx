"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { theme } from "../../theme";

interface CreateDatasetModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateDatasetModal({ onClose, onCreate }: CreateDatasetModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="p-6 rounded-t-2xl" style={{ background: `linear-gradient(to right, ${theme.colors.primary}, #0056b3)` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Create New Dataset</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Dataset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g., Product Documentation"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-gray-200 outline-none transition-all duration-200 font-medium"
              style={{ '--tw-ring-color': theme.colors.primary } as React.CSSProperties}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: theme.colors.primary, boxShadow: `0 10px 40px -10px ${theme.colors.primary}50` }}
            >
              Create Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
