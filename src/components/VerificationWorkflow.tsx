"use client";

import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, Loader2, FileText, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationResult, LabelData } from '@/types';

interface VerificationDisplayProps {
  result: VerificationResult;
}

const VerificationDisplay = ({ result }: VerificationDisplayProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={cn(
        "p-4 rounded-lg flex items-center gap-3",
        result.isValid ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
      )}>
        {result.isValid ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        <span className="font-semibold">{result.overallFeedback}</span>
      </div>

      <div className="grid gap-4">
        {Object.entries(result.fields).map(([key, data]) => (
          <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              {data.isMatch ? (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> MATCH
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> MISMATCH
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Application</span>
                <p className="text-slate-700 font-medium">{data.applicationValue || "(Empty)"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Extracted from Label</span>
                <p className={cn(
                  "font-medium",
                  data.isMatch ? "text-slate-700" : "text-red-600"
                )}>{data.labelValue}</p>
              </div>
            </div>

            {data.feedback && !data.isMatch && (
              <p className="mt-3 text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {data.feedback}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function VerificationWorkflow() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [appData, setAppData] = useState<Partial<LabelData>>({
    brandName: "OLD TOM DISTILLERY",
    classType: "Kentucky Straight Bourbon Whiskey",
    alcoholContent: "45% Alc./Vol. (90 Proof)",
    netContents: "750 mL",
    governmentWarning: "GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems."
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('applicationData', JSON.stringify(appData));

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Label Compliance Verification</h1>
        <p className="text-slate-500 mt-2">Upload a label image to verify against COLA application data.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Application Data & Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Application Data
            </h2>
            <div className="space-y-4">
              {Object.keys(appData).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === 'governmentWarning' ? (
                    <textarea
                      className="w-full p-2 text-sm border border-slate-200 rounded bg-slate-50 h-24"
                      value={appData[key as keyof LabelData]}
                      onChange={(e) => setAppData({...appData, [key]: e.target.value})}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full p-2 text-sm border border-slate-200 rounded bg-slate-50"
                      value={appData[key as keyof LabelData]}
                      onChange={(e) => setAppData({...appData, [key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer",
            file ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
          )} onClick={() => document.getElementById('file-upload')?.click()}>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-12 h-12 text-blue-500 mb-2" />
                <span className="font-medium text-slate-700">{file.name}</span>
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerify();
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Verify Label
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-slate-300 mb-2" />
                <span className="text-slate-500">Click to upload or drag & drop label image</span>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Verification Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 animate-pulse font-medium">Analyzing label artwork...</p>
              <p className="text-xs text-slate-400 mt-1">Running OCR and compliance checks</p>
            </div>
          ) : result ? (
            <VerificationDisplay result={result} />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-slate-400">Waiting for label verification...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
