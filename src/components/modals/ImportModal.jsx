import { X, Info } from 'lucide-react';

export const ImportModal = ({ modals, setModals, importText, setImportText, handleBulkImport }) => {
    if (!modals.import) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModals({ ...modals, import: false })}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 relative" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center pr-16 relative">
                    <h2 className="font-black uppercase tracking-widest text-xs">BuilderTrend Bulk Import</h2>
                    <button onClick={() => setModals({ ...modals, import: false })} className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-500 rounded-full text-slate-900 shadow-md transition-all border border-slate-200 hover:scale-[1.1]"><X size={18} /></button>
                </div>
                <div className="p-8">
                    <div className="bg-blue-50 p-5 rounded-2xl mb-6 text-blue-800 flex items-start gap-4">
                        <Info size={20} className="shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tight">Auto-Parsing Engine Active</p>
                            <p className="text-[11px] leading-relaxed opacity-80 font-medium">Keywords detected: <b>Mason/Chester</b> (Cincy North), <b>Fan/Electric</b> (Complexity), <b>Pergola</b> (4D/Lead Req).</p>
                        </div>
                    </div>
                    <textarea
                        className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-mono text-xs mb-6 text-slate-800 placeholder:text-slate-300"
                        placeholder="Paste tab-separated data from Excel/BuilderTrend here..."
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button onClick={() => setModals({ ...modals, import: false })} className="flex-1 py-4 font-black uppercase tracking-widest text-xs text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                        <button onClick={handleBulkImport} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] transition-all">Execute Import</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
