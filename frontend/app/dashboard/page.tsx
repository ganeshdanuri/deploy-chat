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
function Sidebar({ activeView, setActiveView }) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const menuItems = [
    { id: "home", label: "Home", icon: HiHome },
    { id: "chatbots", label: "Chatbots", icon: HiChatAlt2 },
    { id: "datasets", label: "Datasets", icon: HiDatabase },
    { id: "documents", label: "Documents", icon: HiDocumentText },
    { id: "calendar", label: "Calendar", icon: HiCalendar },
    { id: "analytics", label: "Reports & Analytics", icon: HiChartBar },
  ];

  const projects = [
    { id: "1", name: "Product launch", color: theme.colors.accent.purple },
    { id: "2", name: "Team brainstorm", color: theme.colors.accent.blue },
    { id: "3", name: "Branding launch", color: theme.colors.accent.teal },
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
          <HiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"  />
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
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? "text-white shadow-lg" 
                    : "text-slate-700 hover:bg-white hover:shadow-sm"
                  }
                `}
                style={isActive ? { backgroundColor: theme.colors.primary.main } : {}}
              >
                <Icon className="w-5 h-5"  />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              My Projects
            </h3>
            <button 
              className="text-xs font-semibold flex items-center gap-1 hover:opacity-70"
              style={{ color: theme.colors.primary.main }}
            >
              <HiPlus className="w-3.5 h-3.5"  />
              Add
            </button>
          </div>
          
          <div className="space-y-1.5">
            {projects.map((project) => (
              <button
                key={project.id}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition-all group"
              >
                <MdCircle 
                  className="w-3 h-3 group-hover:scale-110 transition-transform" 
                  fill={project.color} 
                  color={project.color}
                  
                />
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-slate-200">
        <button 
          onClick={() => setActiveView("settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition-all"
        >
          <HiCog className="w-5 h-5"  />
          <span>Settings</span>
        </button>

        {/* Invite Card */}
        <div 
          className="rounded-2xl p-5 shadow-lg text-white"
          style={{ backgroundColor: theme.colors.primary.light }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HiChatAlt2 className="w-5 h-5"  />
            <span className="font-bold text-sm">OpenChat</span>
          </div>
          <p className="text-white/90 text-xs leading-relaxed mb-4">
            New members will gain access to public Spaces, Docs and Dashboards
          </p>
          <button 
            className="w-full bg-white font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ color: theme.colors.primary.main }}
          >
            <HiPlus className="w-4 h-4"  />
            Invite people
          </button>
        </div>
      </div>
    </div>
  );
}

// Home View
function HomeView() {
  const quickActions = [
    { label: "Ask AI", icon: HiSparkles, isPrimary: true },
    { label: "Get tasks updates", icon: HiCheckCircle, isPrimary: false },
    { label: "Create workspace", icon: HiPlus, isPrimary: false },
    { label: "Connect apps", icon: HiGlobeAlt, isPrimary: false },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="text-sm text-slate-600 mb-2">Mon, July 7</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello, Courtney</h1>
        <p className="text-2xl font-medium text-slate-600">
          How can I help you today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-105 shadow-md hover:shadow-lg ${
                action.isPrimary 
                  ? "text-white" 
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
              style={action.isPrimary ? { backgroundColor: theme.colors.primary.light } : {}}
            >
              <Icon className="w-4 h-4"  />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <HiDocumentText className="w-5 h-5 text-slate-700"  />
              <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <HiPlus className="w-4 h-4 text-slate-600"  />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <HiDotsVertical className="w-4 h-4 text-slate-600"  />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Task Group */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-lg">
                  IN PROGRESS
                </div>
                <span className="text-xs text-slate-500">2 tasks</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">One-on-One Meeting</div>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">High</span>
                  <span className="text-xs text-red-600 font-medium">Today</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">Send a summary email to stakeholders</div>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">Low</span>
                  <span className="text-xs text-slate-600 font-medium">3 days left</span>
                </div>
              </div>
            </div>

            <button 
              className="text-sm font-semibold hover:opacity-70 flex items-center gap-1"
              style={{ color: theme.colors.primary.main }}
            >
              + Add task
            </button>
          </div>
        </div>

        {/* Projects Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-slate-700">📊</div>
              <h2 className="text-lg font-bold text-slate-900">Projects</h2>
            </div>
            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Recents ▾
            </button>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group">
              <HiPlus className="w-5 h-5 text-slate-400"  />
              <span className="text-sm font-semibold text-slate-600">Create new project</span>
            </button>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-slate-700 font-bold text-sm">🚀</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Product launch</div>
                <div className="text-xs text-slate-600">6 tasks • 12 teammates</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-slate-700 font-bold text-sm">💡</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Team brainstorm</div>
                <div className="text-xs text-slate-600">2 tasks • 42 teammates</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-slate-700 font-bold text-sm">🎨</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Branding launch</div>
                <div className="text-xs text-slate-600">4 tasks • 9 teammates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chatbots View
function ChatbotsView({ chatbots, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Chatbots</h1>
          <p className="text-slate-600 mt-1">Manage and monitor your embedded AI assistants</p>
        </div>
        <button 
          className="px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          <HiPlus className="w-4 h-4"  />
          Create Chatbot
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary.light }}
            >
              <HiChatAlt2 className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Active Bots</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{chatbots.filter(c => c.status === "active").length}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <HiTrendingUp className="w-5 h-5 text-slate-600"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Conversations</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {chatbots.reduce((sum, c) => sum + c.conversations, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.green }}
            >
              <HiGlobeAlt className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Embedded Sites</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{chatbots.length * 2}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.purple }}
            >
              <HiSparkles className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Avg. Response Time</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">1.2s</div>
        </div>
      </div>

      {/* Chatbots List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Chatbots ({chatbots.length})</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"  />
                <input
                  type="text"
                  placeholder="Search chatbots..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {chatbots.map((bot) => (
            <div key={bot.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shadow-md">
                    <HiChatAlt2 className="w-6 h-6 text-slate-600"  />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{bot.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <HiDatabase className="w-3 h-3"  />
                        {bot.dataset}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiChatAlt2 className="w-3 h-3"  />
                        {bot.conversations} conversations
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiGlobeAlt className="w-3 h-3"  />
                        {bot.embeds || 2} embeds
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-semibold hover:opacity-80 rounded-lg transition-colors text-white"
                    style={{ backgroundColor: theme.colors.primary.light }}
                  >
                    View Details
                  </button>
                  <button 
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <HiDotsVertical className="w-4 h-4 text-slate-600"  />
                  </button>
                  <button
                    onClick={() => onDelete(bot.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Datasets View
function DatasetsView({ datasets, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Datasets</h1>
          <p className="text-slate-600 mt-1">Knowledge sources for your AI chatbots</p>
        </div>
        <button 
          className="px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          <HiPlus className="w-4 h-4"  />
          Create Dataset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.purple }}
            >
              <HiDatabase className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Datasets</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{datasets.length}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary.light }}
            >
              <HiDocumentText className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Documents</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {datasets.reduce((sum, d) => sum + d.items, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.green }}
            >
              <HiGlobeAlt className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">URLs Crawled</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">48</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.yellow }}
            >
              <HiTrendingUp className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Storage Used</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">2.4GB</div>
        </div>
      </div>

      {/* Datasets List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Datasets ({datasets.length})</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"  />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shadow-md">
                    <HiDatabase className="w-6 h-6 text-slate-600"  />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{dataset.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <HiDocumentText className="w-3 h-3"  />
                        {dataset.items} documents
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiClock className="w-3 h-3"  />
                        Created {dataset.created}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiCheckCircle className="w-3 h-3"  />
                        {dataset.chunks || Math.floor(dataset.items * 12)} chunks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-semibold hover:opacity-80 rounded-lg transition-colors text-slate-900 bg-slate-100"
                  >
                    View Details
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <HiDotsVertical className="w-4 h-4 text-slate-600"  />
                  </button>
                  <button
                    onClick={() => onDelete(dataset.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
          <h1 className="text-3xl font-bold text-slate-900">Chunked Documents</h1>
          <p className="text-slate-600 mt-1">View and manage document chunks for RAG</p>
        </div>
        <button 
          className="px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 bg-slate-900"
        >
          <HiPlus className="w-4 h-4"  />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.neutral[900] }}
            >
              <HiDocumentText className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Documents</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{documents.length}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.green }}
            >
              <HiCheckCircle className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Chunks</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {documents.reduce((sum, d) => sum + d.chunks, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.yellow }}
            >
              <HiTrendingUp className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Avg. Chunk Size</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">512</div>
          <div className="text-xs text-slate-500 mt-1">tokens</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent.purple }}
            >
              <HiDatabase className="w-5 h-5 text-white"  />
            </div>
            <div className="text-sm font-semibold text-slate-600">Vector DB Size</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">1.8GB</div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Documents ({documents.length})</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <HiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"  />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shadow-md">
                    <HiDocumentText className="w-6 h-6 text-slate-600"  />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{doc.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded font-semibold">{doc.type}</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiCheckCircle className="w-3 h-3"  />
                        {doc.chunks} chunks
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiDatabase className="w-3 h-3"  />
                        {doc.dataset}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-semibold hover:opacity-80 rounded-lg transition-colors text-slate-900 bg-slate-100"
                  >
                    View Chunks
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <HiDotsVertical className="w-4 h-4 text-slate-600"  />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <HiKey className="w-5 h-5 text-white"  />
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
                  <HiExclamationCircle className="w-4 h-4 text-slate-400"  />
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
            <HiPlus className="w-5 h-5"  />
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
            <HiGlobeAlt className="w-5 h-5 text-white"  />
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

  const handleDeleteDataset = (id) => {
    setDatasets(datasets.filter(ds => ds.id !== id));
  };

  const handleDeleteChatbot = (id) => {
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
          {activeView === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}