"use client";

import React, { useState } from 'react';
import { Layers, Upload, CheckCircle, XCircle, Loader2, Play, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BatchVerificationResult, LabelData, VerificationResult } from '@/types';

export default function BatchWorkflow() {
  const [items, setItems] = useState<BatchVerificationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: BatchVerificationResult[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      status: 'pending'
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const startBatch = async () => {
    setIsProcessing(true);

    // Default application data for simulation
    const appData: Partial<LabelData> = {
      brandName: "OLD TOM DISTILLERY",
      classType: "Kentucky Straight Bourbon Whiskey",
      alcoholContent: "45% Alc./Vol. (90 Proof)",
      netContents: "750 mL",
      governmentWarning: "GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems."
    };

    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== 'pending') continue;

      const currentItem = items[i];
      setItems(prev => prev.map(item =>
        item.id === currentItem.id ? { ...item, status: 'processing' } : item
      ));

      try {
        const formData = new FormData();
        // Create a dummy blob since we don't have the original File object stored in state
        // In a real app we would keep the File objects
        const dummyFile = new File([""], currentItem.fileName, { type: "image/png" });
        formData.append('image', dummyFile);
        formData.append('applicationData', JSON.stringify(appData));

        const response = await fetch('/api/verify', {
          method: 'POST',
          body: formData,
        });

        const result: VerificationResult = await response.json();

        setItems(prev => prev.map(item =>
          item.id === currentItem.id ? { ...item, status: 'completed', result } : item
        ));
      } catch (error) {
        setItems(prev => prev.map(item =>
          item.id === currentItem.id ? { ...item, status: 'failed', error: 'Verification failed' } : item
        ));
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Batch Processing</h1>
          <p className="text-slate-500 mt-2">Upload multiple labels for automated verification.</p>
        </div>

        <div className="flex gap-3">
          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              disabled={isProcessing}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Queue
            </button>
          )}
          <button
            onClick={items.length === 0 ? () => document.getElementById('batch-upload')?.click() : startBatch}
            disabled={isProcessing || (items.length > 0 && !items.some(i => i.status === 'pending'))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : items.length === 0 ? <Upload className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {items.length === 0 ? "Upload Labels" : "Start Batch"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", selectedResult ? "lg:col-span-6" : "lg:col-span-12")}>
          {items.length === 0 ? (
            <div
              className="p-20 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => document.getElementById('batch-upload')?.click()}
            >
              <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">No labels in queue</p>
              <p className="text-slate-400">Click to upload multiple label images</p>
              <input
                id="batch-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">File Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className={cn("hover:bg-slate-50 transition-colors", selectedResult === item.result && "bg-blue-50/50")}>
                    <td className="px-6 py-4 font-medium text-slate-700 text-sm">{item.fileName}</td>
                    <td className="px-6 py-4">
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          Queued
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <Loader2 className="w-3 h-3 animate-spin" /> Analyzing
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
                          item.result?.isValid ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        )}>
                          {item.result?.isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {item.result?.isValid ? "Valid" : "Conflict"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'completed' && item.result ? (
                        <button
                          onClick={() => setSelectedResult(item.result!)}
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          View Report
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedResult && (
          <div className="lg:col-span-6 space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Verification Details
              </h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className={cn(
              "p-4 rounded-xl border flex items-center gap-3 mb-4",
              selectedResult.isValid ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
            )}>
              {selectedResult.isValid ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-semibold">{selectedResult.overallFeedback}</span>
            </div>

            <div className="space-y-3">
              {Object.entries(selectedResult.fields).map(([key, data]) => (
                <div key={key} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {data.isMatch ? (
                      <span className="text-green-600 font-bold">MATCH</span>
                    ) : (
                      <span className="text-red-600 font-bold">MISMATCH</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-slate-500 font-medium truncate">{data.labelValue}</p>
                    </div>
                    {data.feedback && (
                      <p className="text-red-500 italic text-[10px]">{data.feedback}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
