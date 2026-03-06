import { X, Truck, ShieldAlert, Star } from 'lucide-react';

export const CrewManagementModal = ({ modals, setModals, crews, setCrews }) => {
    if (!modals.settings) return null;

    const addCrew = () => {
        const newId = crews.length > 0 ? Math.max(...crews.map(c => c.id)) + 1 : 1;
        setCrews([...crews, { id: newId, name: `Crew ${newId} (Helper)`, isLead: false, leader: 'Unassigned' }]);
    };

    const removeCrew = (id) => {
        if (crews.length <= 1) return alert("Must have at least one crew.");
        setCrews(crews.filter(c => c.id !== id));
    };

    const toggleLead = (id) => {
        setCrews(crews.map(c => {
            if (c.id === id) {
                const isNowLead = !c.isLead;
                const newName = c.name.replace(/\(Lead\)|\(Helper\)/g, '').trim() + (isNowLead ? ' (Lead)' : ' (Helper)');
                return { ...c, isLead: isNowLead, name: newName };
            }
            return c;
        }));
    };

    const updateName = (id, newName) => {
        setCrews(crews.map(c => c.id === id ? { ...c, name: newName } : c));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModals({ ...modals, settings: false })}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center pr-16 relative shrink-0">
                    <h2 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Truck size={16} className="text-blue-500" /> Fleet Database
                    </h2>
                    <button onClick={() => setModals({ ...modals, settings: false })} className="absolute right-4 top-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white shadow-md transition-all border border-slate-600 hover:scale-[1.1]"><X size={18} /></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">

                    {/* Active Fleet Stats Panel */}
                    <div className="bg-white p-5 rounded-2xl mb-8 border border-slate-200 shadow-sm flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <ShieldAlert size={24} className="text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tight text-slate-800">Capacity Management</p>
                            <p className="text-[11px] leading-relaxed text-slate-500 font-medium">Configure active crews for the scheduling board. <br /><b>Note:</b> "Lead" status is required to bypass SOP restrictions on Complex Carpentry, Pergolas, and Electrical jobs.</p>
                        </div>
                    </div>

                    {/* Editor List */}
                    <div className="space-y-3">
                        {crews.map((crew, idx) => (
                            <div key={crew.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 transition-all hover:border-blue-300">

                                <div className="flex-1">
                                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Crew Designation</label>
                                    <input
                                        className="w-full text-sm font-bold text-slate-900 outline-none border-b border-transparent focus:border-blue-500 bg-transparent px-1 py-1 transition-colors"
                                        value={crew.name}
                                        onChange={(e) => updateName(crew.id, e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => toggleLead(crew.id)}
                                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 overflow-hidden transition-all group border-2 ${crew.isLead
                                            ? 'bg-blue-50 border-blue-200 hover:bg-slate-50 hover:border-slate-200'
                                            : 'bg-slate-50 border-slate-100 hover:bg-blue-50 hover:border-blue-200'
                                        }`}
                                >
                                    <Star
                                        size={14}
                                        className={`transition-colors ${crew.isLead ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-400'}`}
                                        fill={crew.isLead ? 'currentColor' : 'none'}
                                    />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${crew.isLead ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                        Lead
                                    </span>
                                </button>

                                <button
                                    onClick={() => removeCrew(crew.id)}
                                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Remove Crew"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addCrew}
                        className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2"
                    >
                        + Register New Crew
                    </button>

                </div>
            </div>
        </div>
    );
};
