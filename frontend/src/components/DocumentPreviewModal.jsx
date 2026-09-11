import React from "react";
import { X, Download, FileText, ExternalLink, ShieldCheck, ZoomIn } from "lucide-react";

const DocumentPreviewModal = ({ doc, onClose }) => {
  if (!doc) return null;

  const isImage = doc.fileData && doc.fileData.startsWith("data:image");
  const isPdf = doc.fileData && doc.fileData.startsWith("data:application/pdf");

  const openInNewWindow = () => {
    if (!doc.fileData) return;
    const win = window.open();
    if (win) {
      if (isImage) {
        win.document.write(`
          <html>
            <head><title>${doc.fileName || "Document Preview"}</title></head>
            <body style="margin:0; background:#0f172a; display:flex; justify-content:center; align-items:center; min-height:100vh;">
              <img src="${doc.fileData}" style="max-width:95vw; max-height:95vh; object-fit:contain; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5);" />
            </body>
          </html>
        `);
      } else if (isPdf) {
        win.document.write(`
          <html>
            <head><title>${doc.fileName || "PDF Document"}</title></head>
            <body style="margin:0; background:#0f172a; height:100vh;">
              <iframe src="${doc.fileData}" style="width:100%; height:100%; border:none;"></iframe>
            </body>
          </html>
        `);
      } else {
        win.location.href = doc.fileData;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {doc.fileCategory || "Document Attachment"}
              </span>
              <h3 className="text-sm font-bold text-white truncate mt-0.5">{doc.fileName || "Document Preview"}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={openInNewWindow}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
              title="Open in Browser Window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Window</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Viewer Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/40 min-h-[300px]">
          {isImage ? (
            <div className="relative group max-w-full max-h-[60vh] flex items-center justify-center">
              <img
                src={doc.fileData}
                alt={doc.fileName}
                className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-slate-800 shadow-2xl bg-slate-900"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[60vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <iframe
                src={doc.fileData}
                title={doc.fileName}
                className="w-full h-full border-none"
              ></iframe>
            </div>
          ) : doc.fileData ? (
            <div className="text-center py-12 space-y-3">
              <FileText className="w-16 h-16 text-blue-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">{doc.fileName}</p>
              <p className="text-xs text-slate-400">File format attached. Click below to view or download.</p>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">No preview available.</div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-IN") : "N/A"}
          </span>

          <div className="flex items-center space-x-3">
            {doc.fileData && (
              <a
                href={doc.fileData}
                download={doc.fileName || "document"}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save to Computer</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
