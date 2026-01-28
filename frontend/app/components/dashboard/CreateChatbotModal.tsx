"use client";

import { useState } from "react";
import { X, Bot } from "lucide-react";
import { theme } from "../../theme";

interface CreateChatbotModalProps {
  datasets: { id: string; name: string }[];
  onClose: () => void;
  onCreate: (name: string, dataset: string) => void;
}

export default function CreateChatbotModal({ 
  datasets, 
  onClose, 
  onCreate 
}: CreateChatbotModalProps) {
  const [name, setName] = useState("");
  const [dataset, setDataset] = useState("");

  const handleSubmit = () => {
    if (name.trim() && dataset) {
      onCreate(name.trim(), dataset);
      setName("");
      setDataset("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="p-6 rounded-t-2xl" style={{ background: `linear-gradient(to right, ${theme.colors.secondary}, #ff6600)` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Create New Chatbot</h3>
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
              Chatbot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Customer Support Bot"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-gray-200 outline-none transition-all duration-200 font-medium"
              style={{ '--tw-ring-color': theme.colors.secondary } as React.CSSProperties}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Dataset
            </label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-gray-200 outline-none bg-white transition-all duration-200 font-medium cursor-pointer"
              style={{ '--tw-ring-color': theme.colors.secondary } as React.CSSProperties}
            >
              <option value="">Choose a dataset...</option>
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.name}>
                  {ds.name}
                </option>
              ))}
            </select>
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
              disabled={!name.trim() || !dataset}
              className="flex-1 px-4 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: theme.colors.secondary, boxShadow: `0 10px 40px -10px ${theme.colors.secondary}50` }}
            >
              Create Chatbot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
