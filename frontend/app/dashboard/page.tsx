"use client";

import { useState } from "react";
import {
  HiHome,
  HiDatabase,
  HiChatAlt2,
  HiDocumentText,
  HiCalendar,
  HiChartBar,
  HiCog,
  HiChevronDown,
  HiPlus,
  HiSearch,
  HiDotsVertical,
  HiExternalLink,
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowRight,
  HiClock,
  HiGlobeAlt,
  HiKey,
  HiSparkles,
  HiTrendingUp,
} from "react-icons/hi";
import { MdCircle } from "react-icons/md";
import { theme } from "../theme";

// Sidebar Component
function Sidebar({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void }) {
  const menuItems = [
    { id: "home", label: "Home", icon: HiHome },
    { id: "chatbots", label: "Chatbots", icon: HiChatAlt2 },
    { id: "datasets", label: "Datasets", icon: HiDatabase },
    { id: "documents", label: "Documents", icon: HiDocumentText },
    { id: "test-chatbots", label: "Test Chatbots", icon: HiSparkles },
    { id: "analytics", label: "Reports & Analytics", icon: HiChartBar },
  ];

  return (
    <div
      className="w-72 h-screen border-r border-slate-200 flex flex-col"
      style={{ background: theme.gradients.page }}
    >
      {/* User Profile */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm text-white"
              style={{ backgroundColor: theme.colors.primary.light }}
            >
              CH
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
              style={{ backgroundColor: theme.colors.accent.green }}
            ></div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">Courtney Henry</h3>
            <p
              className="text-xs font-medium"
              style={{ color: theme.colors.accent.green }}
            >Online</p>
          </div>
          <HiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${isActive
                    ? "text-white shadow-lg"
                    : "text-slate-700 hover:bg-white hover:shadow-sm"
                  }
                `}
                style={isActive ? { backgroundColor: theme.colors.primary.main } : {}}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Projects Section */}

      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-slate-200">
        <button
          onClick={() => setActiveView("settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition-all"
        >
          <HiCog className="w-5 h-5" />
          <span>Settings</span>
        </button>

        {/* Invite Card */}
        <div
          className="rounded-2xl p-5 shadow-lg text-white"
          style={{ backgroundColor: theme.colors.primary.light }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HiChatAlt2 className="w-5 h-5" />
            <span className="font-bold text-sm">OpenChat</span>
          </div>
          <p className="text-white/90 text-xs leading-relaxed mb-4">
            New members will gain access to public Spaces, Docs and Dashboards
          </p>
          <button
            className="w-full bg-white font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ color: theme.colors.primary.main }}
          >
            <HiPlus className="w-4 h-4" />
            Invite people
          </button>
        </div>
      </div>
    </div>
  );
}

// Home View
function HomeView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Platform performance and activity summary</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <HiChatAlt2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">Total Conversations</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">1,248</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
            <HiTrendingUp className="w-3 h-3" />
            <span>+12.5% this week</span>
          </div>
        </div>
        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <HiDatabase className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">Active Datasets</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">12</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
            <span>Across 4 workspaces</span>
          </div>
        </div>
        {/* Metric 3 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <HiSparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">AI Tokens Used</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">842K</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
            <span>Reset in 14 days</span>
          </div>
        </div>
      </div>

      {/* System Status or Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Shortcuts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <HiChatAlt2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors" />
              <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-700">New Chatbot</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
              <HiDatabase className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors" />
              <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700">Add Dataset</span>
            </button>
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-2">System Usage</h3>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Analytics Chart Module</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chatbots View
function ChatbotsView({ chatbots, onDelete }: { chatbots: any[], onDelete: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Chatbots</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and monitor your embedded AI assistants</p>
        </div>
        <button
          className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow hover:opacity-90 transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          <HiPlus className="w-4 h-4" />
          Create Chatbot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats cards similar to HomeView but for chatbots */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Bots</span>
            <HiChatAlt2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{chatbots.filter(c => c.status === "active").length}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Convs</span>
            <HiTrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{chatbots.reduce((sum: number, c: any) => sum + c.conversations, 0)}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Embeds</span>
            <HiGlobeAlt className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{chatbots.length * 2}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Response</span>
            <HiClock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">1.2s</div>
        </div>
      </div>

      {/* Table-like List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">All Chatbots</h3>
          <div className="relative">
            <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Knowledge Base</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-right font-semibold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {chatbots.map(bot => (
                <tr key={bot.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <HiChatAlt2 className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{bot.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${bot.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {bot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <HiDatabase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{bot.dataset}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <div className="font-semibold">{bot.conversations} convs</div>
                      <div className="text-slate-400">{bot.embeds} embeds</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600">
                        <HiExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" onClick={() => onDelete(bot.id)}>
                        <div className="w-4 h-4 text-lg leading-none">×</div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Datasets View
function DatasetsView({ datasets, onDelete }: { datasets: any[], onDelete: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Datasets</h1>
          <p className="text-xs text-slate-500 mt-1">Knowledge sources for your AI chatbots</p>
        </div>
        <button
          className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow hover:opacity-90 transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          <HiPlus className="w-4 h-4" />
          Create Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats cards */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Datasets</span>
            <HiDatabase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{datasets.length}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Docs</span>
            <HiDocumentText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{datasets.reduce((sum: number, d: any) => sum + d.items, 0)}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">URLs Crawled</span>
            <HiGlobeAlt className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">48</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Storage Used</span>
            <HiTrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">2.4GB</div>
        </div>
      </div>

      {/* Table-like List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">All Datasets</h3>
          <div className="relative">
            <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Chunks</th>
                <th className="px-6 py-3 text-right font-semibold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {datasets.map(dataset => (
                <tr key={dataset.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <HiDatabase className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{dataset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <HiDocumentText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dataset.items} docs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <HiClock className="w-3.5 h-3.5" />
                      <span>{dataset.created}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{dataset.chunks || Math.floor(dataset.items * 12)} chunks</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600">
                        <HiExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" onClick={() => onDelete(dataset.id)}>
                        <div className="w-4 h-4 text-lg leading-none">×</div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Documents View
function DocumentsView() {
  const documents = [
    { id: "1", name: "Getting Started Guide.pdf", type: "PDF", size: "2.4 MB", chunks: 48, dataset: "Website Documentation", uploaded: "2024-01-15" },
    { id: "2", name: "API Reference.md", type: "Markdown", size: "890 KB", chunks: 156, dataset: "Website Documentation", uploaded: "2024-01-16" },
    { id: "3", name: "FAQ Collection", type: "Text", size: "340 KB", chunks: 34, dataset: "Product FAQs", uploaded: "2024-01-18" },
    { id: "4", name: "Product Catalog", type: "CSV", size: "1.2 MB", chunks: 87, dataset: "Knowledge Base", uploaded: "2024-01-20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chunked Documents</h1>
          <p className="text-xs text-slate-500 mt-1">View and manage document chunks for RAG</p>
        </div>
        <button
          className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow hover:opacity-90 transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          <HiPlus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Docs</span>
            <HiDocumentText className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold text-slate-900">{documents.length}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Chunks</span>
            <HiCheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{documents.reduce((sum, d) => sum + d.chunks, 0)}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Chunk Size</span>
            <HiTrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">512 <span className="text-xs text-slate-400 font-normal">tokens</span></div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Vector DB Size</span>
            <HiDatabase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">1.8GB</div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">All Documents</h3>
          <div className="relative">
            <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Type & Size</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Dataset</th>
                <th className="px-6 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Chunks</th>
                <th className="px-6 py-3 text-right font-semibold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <HiDocumentText className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 border border-slate-200">{doc.type}</span>
                      <span className="text-xs text-slate-500">{doc.size}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <HiDatabase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.dataset}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <HiCheckCircle className="w-3.5 h-3.5" />
                      <span className="font-medium">{doc.chunks} chunks</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600">
                        <HiExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600">
                        <div className="w-4 h-4 text-lg leading-none">×</div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// Test Chatbots View
function TestChatbotsView() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true },
    { id: 2, text: "Hi, I need help with my dataset.", isBot: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, isBot: false }]);
    setInput("");
    // Simulate reponse
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I can help with that. What specific question do you have?", isBot: true }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-800">Test Your Chatbot</h2>
        <select className="text-xs border-slate-200 rounded-lg p-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option>Select Chatbot...</option>
          <option>Customer Support Bot</option>
          <option>Sales Assistant</option>
        </select>
      </div>
      <div className="flex-1 p-4 bg-slate-50/50 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${!msg.isBot ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isBot ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"}`}>
              {msg.isBot ? "AI" : "You"}
            </div>
            <div className={`p-3 rounded-2xl shadow-sm max-w-[80%] ${msg.isBot ? "bg-white rounded-tl-none border border-slate-100 text-slate-600" : "bg-indigo-600 rounded-tr-none text-white"}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 text-sm border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 bg-slate-50"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Analytics View
function AnalyticsView() {
  return (
    <div className="flex items-center justify-center h-[60vh] text-slate-500">
      <div className="text-center">
        <HiChartBar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <h3 className="text-lg font-medium text-slate-900">Analytics</h3>
        <p>Detailed reports coming soon</p>
      </div>
    </div>
  );
}

// Settings View
function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and API configurations</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: theme.colors.neutral[900] }}
          >
            <HiKey className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Model API Keys</h2>
            <p className="text-sm text-slate-600">Configure your AI model providers</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.accent.green}20` }}
                >
                  <HiCheckCircle
                    className="w-4 h-4"

                    style={{ color: theme.colors.accent.green }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">OpenAI</div>
                  <div className="text-xs text-slate-500">GPT-4, GPT-3.5 Turbo</div>
                </div>
              </div>
              <span
                className="px-3 py-1 text-xs font-bold rounded-lg"
                style={{ backgroundColor: `${theme.colors.accent.green}20`, color: theme.colors.accent.green }}
              >Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value="sk-proj-••••••••••••••••••••••••"
                disabled
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
              <button
                className="px-4 py-2 text-sm font-semibold hover:opacity-80 rounded-lg transition-colors text-slate-900 bg-slate-100"
              >
                Update
              </button>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <HiExclamationCircle className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Anthropic Claude</div>
                  <div className="text-xs text-slate-500">Claude 3 Sonnet, Opus</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Not Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter your Anthropic API key"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2"
              />
              <button
                className="px-4 py-2 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                style={{ backgroundColor: theme.colors.primary.main }}
              >
                Connect
              </button>
            </div>
          </div>

          <button className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-semibold">
            <HiPlus className="w-5 h-5" />
            Add Another Provider
          </button>
        </div>
      </div>

      {/* Embed Settings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: theme.colors.accent.green }}
          >
            <HiGlobeAlt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Embed Settings</h2>
            <p className="text-sm text-slate-600">Configure default widget behavior</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-2 block">Default Widget Position</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option>Bottom Right</option>
              <option>Bottom Left</option>
              <option>Top Right</option>
              <option>Top Left</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 mb-2 block">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.neutral[900]}
                className="w-12 h-12 rounded-lg border border-slate-200"
              />
              <input
                type="text"
                value={theme.colors.neutral[900]}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 focus:ring-0"
                style={{
                  accentColor: theme.colors.neutral[900]
                }}
                defaultChecked
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">Show "Powered by OpenChat"</div>
                <div className="text-xs text-slate-500">Display branding in widget footer</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [activeView, setActiveView] = useState("home");

  const [datasets, setDatasets] = useState([
    { id: "1", name: "Website Documentation", items: 120, created: "2024-01-15" },
    { id: "2", name: "Product FAQs", items: 34, created: "2024-01-18" },
    { id: "3", name: "Knowledge Base", items: 87, created: "2024-01-20" },
  ]);

  const [chatbots, setChatbots] = useState([
    { id: "1", name: "Customer Support Bot", dataset: "Website Documentation", status: "active", conversations: 247, embeds: 3 },
    { id: "2", name: "Sales Assistant", dataset: "Product FAQs", status: "active", conversations: 156, embeds: 2 },
    { id: "3", name: "Technical Helper", dataset: "Knowledge Base", status: "inactive", conversations: 89, embeds: 1 },
  ]);

  const handleDeleteDataset = (id: string) => {
    setDatasets(datasets.filter(ds => ds.id !== id));
  };

  const handleDeleteChatbot = (id: string) => {
    setChatbots(chatbots.filter(bot => bot.id !== id));
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ background: theme.gradients.page }}
    >
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          {activeView === "home" && <HomeView />}
          {activeView === "chatbots" && <ChatbotsView chatbots={chatbots} onDelete={handleDeleteChatbot} />}
          {activeView === "datasets" && <DatasetsView datasets={datasets} onDelete={handleDeleteDataset} />}
          {activeView === "documents" && <DocumentsView />}
          {activeView === "test-chatbots" && <TestChatbotsView />}
          {activeView === "analytics" && <AnalyticsView />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}