import { List } from 'lucide-react';
import { JobCard } from '../cards/JobCard';

export const JobBacklog = ({ backlog, activeSelection, draggedItem, setDraggedItem, setActiveSelection, handleDropToBacklog }) => {
    return (
        <div
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToBacklog}
        >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <List size={16} className="text-blue-500" /> Job Backlog
                </h3>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black tracking-widest">
                    {backlog.length}
                </span>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {backlog.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        activeSelection={activeSelection}
                        draggedItem={draggedItem}
                        setDraggedItem={setDraggedItem}
                        setActiveSelection={setActiveSelection}
                    />
                ))}

                {backlog.length === 0 && (
                    <div className="text-center py-20 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Queue Empty</div>
                )}
            </div>
        </div>
    );
};
