import { Plus } from 'lucide-react';
import { JobCard } from '../cards/JobCard';
import { DAYS } from '../../data/constants';

export const ScheduleGrid = ({
    crews,
    schedule,
    scheduledJobs,
    weather,
    activeSelection,
    draggedItem,
    dragOverCell,
    setDragOverCell,
    handleDrop,
    setDraggedItem,
    setActiveSelection,
    removeFromSchedule
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-6 bg-slate-900 text-white">
                <div className="p-5 border-r border-slate-800" />
                {DAYS.map(day => (
                    <div key={day} className="p-5 text-center text-[11px] font-black uppercase tracking-[0.3em] opacity-50">
                        {day}
                    </div>
                ))}
            </div>

            {/* Crew Rows */}
            {crews.map(crew => {
                const crewJobs = scheduledJobs.filter(j => (Object.values(schedule[crew.id] || {}).includes(j.id)));
                const crewProd = crewJobs.reduce((s, j) => s + j.value, 0);

                return (
                    <div key={crew.id} className="grid grid-cols-6 border-b border-slate-100 last:border-0 min-h-[160px]">
                        {/* Crew Info Sidebar */}
                        <div className="p-6 border-r border-slate-50 bg-slate-50/50 flex flex-col justify-center">
                            <span className="font-black text-slate-900 text-xs uppercase tracking-tight mb-0.5">{crew.name}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${crew.isLead ? 'text-blue-600' : 'text-slate-400'}`}>
                                {crew.isLead ? 'Lead Foreman' : 'Helper Crew'}
                            </span>
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mb-1">
                                    <span className={crewProd >= 20000 ? 'text-emerald-500' : ''}>${(crewProd / 1000).toFixed(1)}k</span>
                                    <span>Goal: $20k</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${crewProd >= 20000 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min((crewProd / 20000) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Day Slots */}
                        {DAYS.map((day, dIdx) => {
                            const jobId = schedule[crew.id]?.[dIdx];
                            const job = jobId ? scheduledJobs.find(j => j.id === jobId) : null;

                            // Skip if this is a continuation of a multi-day job
                            if (job && schedule[crew.id]?.[dIdx - 1] === jobId) return null;

                            const risks = job ? [
                                (weather.isFreezing ? "Temp Lock" : null),
                                (weather.isRaining && (job.type === 'USI' || job.type === 'Pergola') ? "Rain Risk" : null),
                                (weather.isWindy && (job.elevation === '2nd Story' || job.type === 'Pergola') ? "Wind Risk" : null),
                                (job.subRegion === 'North' && job.location === 'Cincinnati' ? "Traffic Buffer" : null),
                                (job.hasElectrical && !crew.isLead ? "Lead Req." : null)
                            ].filter(Boolean) : [];

                            return (
                                <div
                                    key={dIdx}
                                    className={`p-2 relative flex items-stretch col-span-${job ? job.duration : 1}`}
                                    onDragOver={e => { e.preventDefault(); setDragOverCell(`${crew.id}-${dIdx}`); }}
                                    onDragLeave={() => setDragOverCell(null)}
                                    onDrop={e => handleDrop(e, crew.id, dIdx)}
                                >
                                    {job ? (
                                        <JobCard
                                            job={job}
                                            draggedItem={draggedItem}
                                            setDraggedItem={setDraggedItem}
                                            removeFromSchedule={removeFromSchedule}
                                            risks={risks}
                                        />
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (activeSelection) {
                                                    setDraggedItem({ type: 'backlog', job: activeSelection });
                                                    setTimeout(() => handleDrop({ preventDefault: () => { } }, crew.id, dIdx), 0);
                                                    setActiveSelection(null);
                                                }
                                            }}
                                            className={`w-full rounded-[1.5rem] border-2 border-dashed flex items-center justify-center transition-all ${dragOverCell === `${crew.id}-${dIdx}` ? 'bg-blue-50 border-blue-400 scale-[1.02]' : (activeSelection ? 'bg-blue-50/50 border-blue-200 hover:bg-blue-100' : 'border-slate-200 bg-slate-50/20 hover:bg-slate-100')}`}
                                        >
                                            <Plus size={28} className={activeSelection ? 'text-blue-400' : 'text-slate-200'} strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
