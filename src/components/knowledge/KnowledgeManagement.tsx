import React, { useState } from 'react';
import { KnowledgeDocument, RestaurantProfile } from '../../types';
import {
  BookOpen,
  Upload,
  FileText,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Eye,
  FileUp,
  Sparkles,
  Plus,
  Save,
  Check,
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

interface KnowledgeManagementProps {
  documents: KnowledgeDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<KnowledgeDocument[]>>;
  restaurant: RestaurantProfile;
  setRestaurant: React.Dispatch<React.SetStateAction<RestaurantProfile>>;
}

export const KnowledgeManagement: React.FC<KnowledgeManagementProps> = ({
  documents,
  setDocuments,
  restaurant,
  setRestaurant,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [manualText, setManualText] = useState(restaurant.additionalInfo || '');
  const [manualCategory, setManualCategory] = useState<'General' | 'Parking' | 'Menu' | 'Dress Code'>('Parking');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);

  const handleSimulateUpload = (customName?: string) => {
    const defaultNewDocName = customName || `Seasonal_Specials_${new Date().toLocaleString('en-US', { month: 'short' })}.pdf`;
    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      name: defaultNewDocName,
      type: defaultNewDocName.endsWith('.docx') ? 'DOCX' : defaultNewDocName.endsWith('.txt') ? 'TXT' : 'PDF',
      size: '1.2 MB',
      uploadedAt: 'Just now',
      status: 'Ready',
      category: 'Menu',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSaveToast(`Successfully uploaded and indexed "${newDoc.name}".`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleDeleteDoc = (id: string, name: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSaveToast(`Removed "${name}" from knowledge base.`);
    setActiveMenuDocId(null);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveManualInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurant((prev) => ({
      ...prev,
      additionalInfo: manualText,
    }));
    setSaveToast('Restaurant information saved & synced.');
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 text-slate-900">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Knowledge Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the information used to answer customer inquiries and booking questions.
          </p>
        </div>
      </div>

      {/* Toast Feedback */}
      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Section 1: Upload Area (Large Drag & Drop Zone) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Upload Documents
          </h2>
          <span className="text-xs text-slate-500">
            Supported formats: <strong className="text-slate-700">PDF, DOCX, TXT</strong>
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleSimulateUpload('Restaurant_Special_Events_2026.pdf');
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging
              ? 'border-slate-800 bg-slate-100'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-2xs">
              <span className="text-xl font-bold">↑</span>
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">Drop files here</p>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop your latest menus, beverage pricing, or seasonal FAQ sheets.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleSimulateUpload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload Documents</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Uploaded Documents Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Uploaded Documents</h2>
            <p className="text-xs text-slate-500">
              Files parsed and synchronized with the restaurant knowledge base.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {documents.length} Files Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-slate-400">
                      <FileText className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="font-semibold text-sm text-slate-700">No documents uploaded yet</p>
                      <p className="text-xs text-slate-500">
                        Upload your menus, wine lists, FAQs, or parking guidelines above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.name}</span>
                        <span className="text-[11px] text-slate-500">{doc.size} · {doc.category}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-medium">
                      {doc.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                    {doc.uploadedAt}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {doc.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right relative">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        title="Preview document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id, doc.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Add Information Manually (Text Editor) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Restaurant Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              A text editor where the manager can manually add information, daily specials, or operational updates.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {(['Parking', 'Dress Code', 'Menu', 'General'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setManualCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  manualCategory === cat
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSaveManualInfo} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. Parking is available behind the restaurant after 18:00."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 leading-relaxed font-sans focus:bg-white"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Example: Parking is available behind the restaurant after 18:00.</span>
              <span>Category: <strong className="text-white bg-slate-900 px-2 py-0.5 rounded text-xs">{manualCategory}</strong></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant knowledge base synchronization</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Information</span>
            </button>
          </div>
        </form>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">{previewDoc.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 space-y-2 font-mono leading-relaxed max-h-60 overflow-y-auto">
              <p className="text-slate-900 font-bold">// Parsed Document Content</p>
              <p>Document: {previewDoc.name}</p>
              <p>Category: {previewDoc.category} · Size: {previewDoc.size}</p>
              <p className="text-slate-500">--- Content Excerpt ---</p>
              <p>
                "Document parsed and indexed. Grounding data available for operational inquiries, dietary questions, and reservation policies."
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
