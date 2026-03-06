import { Zap, MapPin } from 'lucide-react';

export const JobCard = ({ job, activeSelection, draggedItem, setDraggedItem, setActiveSelection, removeFromSchedule, risks = [] }) => {

    const openInMaps = (address) => {
        if (!address) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    };

    const isBacklog = !removeFromSchedule; // If no remove function is passed, it's a backlog card

    if (isBacklog) {
        return (
            <div
                draggable={true}
                onDragStart={(e) => { setDraggedItem({ type: 'backlog', job }); setActiveSelection(null); }}
                onDragEnd={() => setDraggedItem(null)}
                onClick={() => setActiveSelection(activeSelection?.id === job.id ? null : job)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${activeSelection?.id === job.id ? 'border-blue-500 bg-blue-50 shadow-md ring-4 ring-blue-50' : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'} ${draggedItem?.job?.id === job.id ? 'opacity-50' : 'opacity-100'}`}
            >
                <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="font-black text-[11px] uppercase tracking-tighter text-slate-800 leading-tight pr-2">{job.name}</span>
                    {job.hasElectrical && <Zap size={14} className="text-amber-500 shrink-0" fill="currentColor" />}
                </div>

                {job.address && (
                    <button onClick={(e) => { e.stopPropagation(); openInMaps(job.address); }} className="text-[10px] text-blue-500 font-bold mb-2 flex flex-col items-start gap-1 hover:underline truncate w-full pr-4 uppercase tracking-tighter text-left">
                        <span className="flex items-center"><MapPin size={10} className="inline mr-1 shrink-0" />{job.address.split(',')[0]}</span>
                    </button>
                )}

                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-4 flex items-center gap-1">
                    {job.location} • {job.subRegion}
                </div>
                <div className="flex justify-between items-end">
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black">${job.value.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded tracking-tighter">
                        {job.duration} DAYS
                    </div>
                </div>
            </div>
        );
    }

    // Scheduled Card Variation
    return (
        <div
            draggable={true}
            onDragStart={e => setDraggedItem({ type: 'board', job })}
            onDragEnd={() => setDraggedItem(null)}
            className={`w-full rounded-[1.5rem] p-4 border-2 shadow-sm transition-all group relative overflow-hidden flex flex-col justify-between ${risks.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-blue-300'} ${draggedItem?.job?.id === job.id ? 'opacity-40 scale-95' : 'opacity-100'}`}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                    <span className={`text-[11px] font-black uppercase leading-tight line-clamp-2 ${risks.length > 0 ? 'text-red-900' : 'text-slate-900'}`}>{job.name}</span>

                    {job.address && (
                        <button onClick={(e) => { e.stopPropagation(); openInMaps(job.address); }} className={`text-[9px] font-bold mt-1.5 flex flex-col items-start gap-1 hover:underline text-left uppercase tracking-tighter ${risks.length > 0 ? 'text-red-700' : 'text-slate-500'}`}><span className="flex items-center"><MapPin size={10} className="shrink-0 mr-1" /> {job.address.split(',')[0]}</span></button>
                    )}
                </div>

                {/* Repositioned X button matching the requested high-contrast white circle UI */}
                <button
                    onClick={() => removeFromSchedule(job.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-slate-900 border border-slate-200 shadow-sm hover:border-red-500 hover:text-red-500 transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
                {risks.map((r, i) => (
                    <span key={i} className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg> {r}
                    </span>
                ))}
                {risks.length === 0 && <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase border border-emerald-200">Ready</span>}
            </div>

            <div className="flex justify-between items-center mt-5">
                <span className="text-sm font-black text-slate-900 tracking-tight">${job.value.toLocaleString()}</span>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                    {job.duration}D
                </span>
            </div>
        </div>
    );
}
