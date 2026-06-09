"use client";

import React, { useState } from 'react';
import VerificationWorkflow from '@/components/VerificationWorkflow';
import BatchWorkflow from '@/components/BatchWorkflow';
import { Search, LayoutGrid, CheckSquare, History, Settings, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'single', label: 'Single Verification', icon: CheckSquare },
    { id: 'batch', label: 'Batch Processing', icon: LayoutGrid },
    { id: 'history', label: 'Audit History', icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-800">TTB Verifier</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => (item.id === 'single' || item.id === 'batch') && setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
              )} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications (COLA ID, Brand...)"
              className="bg-transparent border-none focus:ring-0 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">Agent Jenkins</p>
              <p className="text-xs text-slate-500">Compliance Division</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              AJ
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-0">
          {activeTab === 'single' ? <VerificationWorkflow /> : <BatchWorkflow />}
        </div>
      </main>
    </div>
  );
}
