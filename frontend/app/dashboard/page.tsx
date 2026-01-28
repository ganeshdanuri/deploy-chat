"use client";

import { useState } from "react";
import { Database, MessageSquare, FileText } from "lucide-react";
import { theme } from "../theme";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ChatbotCard from "../components/dashboard/ChatbotCard";
import DatasetCard from "../components/dashboard/DatasetCard";
import EmptyState from "../components/dashboard/EmptyState";
import CreateDatasetModal from "../components/dashboard/CreateDatasetModal";
import CreateChatbotModal from "../components/dashboard/CreateChatbotModal";
import ProtectedRoute from "../components/ProtectedRoute";

interface Chatbot {
  id: string;
  name: string;
  dataset: string;
  status: "active" | "inactive";
  conversations: number;
}

interface Dataset {
  id: string;
  name: string;
  items: number;
  created: string;
}

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: "1", name: "Website Documentation", items: 120, created: "2024-01-15" },
    { id: "2", name: "Product FAQs", items: 34, created: "2024-01-18" },
    { id: "3", name: "Knowledge Base", items: 87, created: "2024-01-20" },
  ]);

  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  const handleCreateDataset = (name: string) => {
    const newDataset = {
      id: String(datasets.length + 1),
      name,
      items: 0,
      created: new Date().toISOString().split('T')[0]
    };
    setDatasets([...datasets, newDataset]);
    setShowDatasetModal(false);
  };

  const handleCreateChatbot = (name: string, datasetName: string) => {
    const newChatbot = {
      id: String(chatbots.length + 1),
      name,
      dataset: datasetName,
      status: "active" as const,
      conversations: 0
    };
    setChatbots([...chatbots, newChatbot]);
    setShowChatbotModal(false);
  };

  const handleDeleteDataset = (id: string) => {
    setDatasets(datasets.filter(ds => ds.id !== id));
  };

  const handleDeleteChatbot = (id: string) => {
    setChatbots(chatbots.filter(bot => bot.id !== id));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-screen bg-white">
        {/* Header */}
        <DashboardHeader
          onCreateDataset={() => setShowDatasetModal(true)}
          onCreateChatbot={() => setShowChatbotModal(true)}
        />

        <div className="w-full px-6 py-12 space-y-16">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard
            icon={<MessageSquare className="w-6 h-6" strokeWidth={2} />}
            label="Active Chatbots"
            value={chatbots.filter(b => b.status === "active").length}
            bgColor={theme.colors.primary.main}
            iconColor="text-white"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={<Database className="w-6 h-6" strokeWidth={2} />}
            label="Datasets"
            value={datasets.length}
            bgColor={theme.colors.accent.purple}
            iconColor="text-white"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={<FileText className="w-6 h-6" strokeWidth={2} />}
            label="Total Documents"
            value={datasets.reduce((sum, ds) => sum + ds.items, 0)}
            bgColor={theme.colors.accent.green}
            iconColor="text-white"
          />
        </div>

        {/* Chatbots Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Chatbots</h2>
              <p className="text-sm text-gray-600 mt-2">Manage and monitor your AI assistants</p>
            </div>
            <span className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 rounded-lg">
              {chatbots.length} total
            </span>
          </div>

          {chatbots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map((bot) => (
                <ChatbotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  dataset={bot.dataset}
                  status={bot.status}
                  conversations={bot.conversations}
                  onDelete={handleDeleteChatbot}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="w-12 h-12" strokeWidth={2} />}
              title="No chatbots yet"
              description="Create your first AI chatbot to start engaging with your customers"
              actionLabel="Create Chatbot"
              onAction={() => setShowChatbotModal(true)}
            />
          )}
        </section>

        {/* Datasets Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Datasets</h2>
              <p className="text-sm text-gray-600 mt-2">Training data for your chatbots</p>
            </div>
            <span className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 rounded-lg">
              {datasets.length} total
            </span>
          </div>

          {datasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((ds) => (
                <DatasetCard
                  key={ds.id}
                  id={ds.id}
                  name={ds.name}
                  items={ds.items}
                  created={ds.created}
                  onDelete={handleDeleteDataset}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Database className="w-12 h-12" strokeWidth={2} />}
              title="No datasets yet"
              description="Create a dataset to store documents that will train your chatbots"
              actionLabel="Create Dataset"
              onAction={() => setShowDatasetModal(true)}
            />
          )}
        </section>
      </div>

      {/* Modals */}
      {showDatasetModal && (
        <CreateDatasetModal
          onClose={() => setShowDatasetModal(false)}
          onCreate={handleCreateDataset}
        />
      )}

      {showChatbotModal && (
        <CreateChatbotModal
          datasets={datasets}
          onClose={() => setShowChatbotModal(false)}
          onCreate={handleCreateChatbot}
        />
      )}
    </div>
    </ProtectedRoute>
  );
}