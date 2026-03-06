import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Upload, Plus } from 'lucide-react';

import { INITIAL_CREWS, DAYS, INITIAL_BACKLOG } from './data/constants';
import { MetricDashboard } from './components/MetricDashboard';
import { JobBacklog } from './components/job-board/JobBacklog';
import { ScheduleGrid } from './components/job-board/ScheduleGrid';
import { ImportModal } from './components/modals/ImportModal';
import { ManualEntryModal } from './components/modals/ManualEntryModal';
import { CrewManagementModal } from './components/modals/CrewManagementModal';

export const App = () => {
    const [crews, setCrews] = useState(INITIAL_CREWS);
    const [backlog, setBacklog] = useState(INITIAL_BACKLOG);
    const [schedule, setSchedule] = useState({});
    const [scheduledJobs, setScheduledJobs] = useState([]);

    // UI State
    const [activeSelection, setActiveSelection] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverCell, setDragOverCell] = useState(null);
    const [weather, setWeather] = useState({ isFreezing: false, isRaining: false, isWindy: false });
    const [modals, setModals] = useState({ add: false, import: false, settings: false });

    // Modal Form State
    const [importText, setImportText] = useState('');
    const [newJob, setNewJob] = useState({
        name: '', value: '', duration: 1, type: 'Screen',
        location: 'Louisville', subRegion: 'Central', address: '', complexity: 'Standard',
        isBuilder: false, hasElectrical: false, elevation: 'Ground',
        materialsReady: false, siteReady: false
    });

    // Derived Metrics
    const currentTotal = useMemo(() => scheduledJobs.reduce((sum, j) => sum + j.value, 0), [scheduledJobs]);
    const lowValueCount = useMemo(() => scheduledJobs.filter(j => j.value < 3000).length, [scheduledJobs]);
    const isFluffHeavy = lowValueCount > 5;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setModals({ add: false, import: false, settings: false });
                setActiveSelection(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleDrop = (e, targetCrewId, targetDayIdx) => {
        e.preventDefault();
        setDragOverCell(null);
        if (!draggedItem) return;

        const { type, job, sourceCrewId, sourceDayIdx } = draggedItem;
        const targetCrew = crews.find(c => c.id === targetCrewId);

        if (targetDayIdx + job.duration > DAYS.length) {
            alert(`This ${job.duration}-day job won't fit starting on ${DAYS[targetDayIdx]}.`);
            setDraggedItem(null);
            return;
        }

        const needsLead = job.complexity === 'Complex' || job.type === 'Pergola' || job.hasElectrical || job.elevation === '2nd Story';
        if (needsLead && !targetCrew.isLead) {
            const confirmLead = window.confirm(`SOP WARNING: This job involves ${job.hasElectrical ? 'Electrical' : 'Complex Carpentry'} which requires a Lead Foreman. Crew ${targetCrew.name} is a helper crew. Proceed anyway?`);
            if (!confirmLead) {
                setDraggedItem(null);
                return;
            }
        }

        const currentCrewSchedule = schedule[targetCrewId] || {};
        for (let i = 0; i < job.duration; i++) {
            const existingJobId = currentCrewSchedule[targetDayIdx + i];
            if (existingJobId && existingJobId !== job.id) {
                alert("Schedule Conflict: Day is already booked.");
                setDraggedItem(null);
                return;
            }
        }

        const newSchedule = { ...schedule };
        if (type === 'board') {
            const oldCrewDays = { ...newSchedule[sourceCrewId] };
            for (let i = 0; i < job.duration; i++) delete oldCrewDays[sourceDayIdx + i];
            newSchedule[sourceCrewId] = oldCrewDays;
        }

        const newCrewDays = { ...(newSchedule[targetCrewId] || {}) };
        for (let i = 0; i < job.duration; i++) newCrewDays[targetDayIdx + i] = job.id;
        newSchedule[targetCrewId] = newCrewDays;

        setSchedule(newSchedule);
        if (type === 'backlog') {
            setScheduledJobs(prev => [...prev, job]);
            setBacklog(prev => prev.filter(j => j.id !== job.id));
        }
        setDraggedItem(null);
    };

    const removeFromSchedule = (jobId) => {
        const jobToRemove = scheduledJobs.find(j => j.id === jobId);
        const newSchedule = { ...schedule };
        Object.keys(newSchedule).forEach(crewId => {
            const crewDays = { ...newSchedule[crewId] };
            Object.keys(crewDays).forEach(dayIdx => { if (crewDays[dayIdx] === jobId) delete crewDays[dayIdx]; });
            newSchedule[crewId] = crewDays;
        });
        setSchedule(newSchedule);
        setScheduledJobs(prev => prev.filter(j => j.id !== jobId));
        if (jobToRemove) setBacklog(prev => [...prev, jobToRemove]);
    };

    const handleBulkImport = () => {
        if (!importText.trim()) return;
        const rows = importText.split('\\n');
        const imported = rows.map(row => {
            const cols = row.split('\\t');
            if (cols.length < 2) return null;
            const name = cols[0].trim();
            if (!name) return null;
            const value = parseFloat(cols[1]?.replace(/[^0-9.]/g, '')) || 0;
            const address = cols[5] || '';

            const isNorth = address.toLowerCase().includes('mason') || address.toLowerCase().includes('west chester') || address.toLowerCase().includes('north');
            const isComplex = name.toLowerCase().includes('pergola') || name.toLowerCase().includes('usi') || name.toLowerCase().includes('fan') || name.toLowerCase().includes('electric');

            return {
                id: 'j-' + Math.random().toString(36).substr(2, 9),
                name, value,
                duration: parseInt(cols[2]) || 3,
                type: name.toLowerCase().includes('pergola') ? 'Pergola' : (name.toLowerCase().includes('service') ? 'Service' : 'Screen'),
                location: address.toLowerCase().includes('ky') ? 'Louisville' : 'Cincinnati',
                subRegion: isNorth ? 'North' : 'Central',
                address,
                complexity: isComplex ? 'Complex' : 'Standard',
                hasElectrical: name.toLowerCase().includes('fan') || name.toLowerCase().includes('electric'),
                isBuilder: (cols[7] && cols[7].toLowerCase().includes('yes')) ? true : false,
                elevation: 'Ground',
                materialsReady: true, siteReady: true
            };
        }).filter(Boolean);

        setBacklog(prev => [...prev, ...imported]);
        setModals({ ...modals, import: false });
        setImportText('');
    };

    return (
        <div className="min-h-screen p-4 lg:p-8 max-w-[1600px] mx-auto bg-slate-50 text-slate-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Calendar size={32} className="text-blue-600" />
                        US Custom Creations <span className="text-blue-600">Weekly Scheduler</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1 italic">
                        SOP Rules: Skill Matching, Cincinnati North Buffers, and Weekly $45k Target Tracking.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setModals({ ...modals, import: true })}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Upload size={16} /> IMPORT BUILDERTREND DATA
                    </button>
                    <button
                        onClick={() => setModals({ ...modals, add: true })}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Plus size={16} /> NEW JOB
                    </button>
                </div>
            </div>

            <MetricDashboard
                currentTotal={currentTotal}
                isFluffHeavy={isFluffHeavy}
                weather={weather}
                setWeather={setWeather}
                modals={modals}
                setModals={setModals}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-3 space-y-4">
                    <JobBacklog
                        backlog={backlog}
                        activeSelection={activeSelection}
                        draggedItem={draggedItem}
                        setDraggedItem={setDraggedItem}
                        setActiveSelection={setActiveSelection}
                    />
                </div>
                <div className="lg:col-span-9">
                    <ScheduleGrid
                        crews={crews}
                        schedule={schedule}
                        scheduledJobs={scheduledJobs}
                        weather={weather}
                        activeSelection={activeSelection}
                        draggedItem={draggedItem}
                        dragOverCell={dragOverCell}
                        setDragOverCell={setDragOverCell}
                        handleDrop={handleDrop}
                        setDraggedItem={setDraggedItem}
                        setActiveSelection={setActiveSelection}
                        removeFromSchedule={removeFromSchedule}
                    />
                </div>
            </div>

            <ImportModal
                modals={modals}
                setModals={setModals}
                importText={importText}
                setImportText={setImportText}
                handleBulkImport={handleBulkImport}
            />
            <ManualEntryModal
                modals={modals}
                setModals={setModals}
                backlog={backlog}
                setBacklog={setBacklog}
                newJob={newJob}
                setNewJob={setNewJob}
            />
            <CrewManagementModal
                modals={modals}
                setModals={setModals}
                crews={crews}
                setCrews={setCrews}
            />
        </div>
    );
};
export default App;
