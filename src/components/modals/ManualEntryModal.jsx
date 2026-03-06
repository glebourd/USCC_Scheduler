import { useState, useRef, useEffect } from 'react';
import { X, Search, MapPin, Loader2 } from 'lucide-react';

export const ManualEntryModal = ({ modals, setModals, backlog, setBacklog, newJob, setNewJob }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!modals.add) return null;

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            const results = data.features.map(f => {
                const p = f.properties;
                const parts = [p.name, p.street, p.city, p.state, p.postcode].filter(Boolean);
                return parts.join(', ');
            });
            setSuggestions([...new Set(results)]);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Geocoding failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddressChange = (e) => {
        const val = e.target.value;
        setNewJob({ ...newJob, address: val });
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => fetchSuggestions(val), 300);
    };

    const selectSuggestion = (address) => {
        setNewJob({ ...newJob, address });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModals({ ...modals, add: false })}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl text-slate-900 border border-slate-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-blue-600 text-white flex justify-between items-center relative">
                    <h2 className="font-black uppercase tracking-widest text-sm">New Production Entry</h2>
                    <button onClick={() => setModals({ ...modals, add: false })} className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-500 rounded-full shadow-md text-slate-900 border border-slate-200 transition-all hover:scale-[1.1]"><X size={18} /></button>
                </div>
                <form className="p-7 space-y-4 max-h-[75vh] overflow-y-auto" onSubmit={e => { e.preventDefault(); setBacklog([...backlog, { ...newJob, id: Date.now().toString() }]); setModals({ ...modals, add: false }); }}>
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Client / Account</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold placeholder:text-slate-300 outline-none focus:border-blue-500" placeholder="e.g. Thompson Residence" value={newJob.name} onChange={e => setNewJob({ ...newJob, name: e.target.value })} required />
                    </div>
                    <div className="relative" ref={suggestionRef}>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Job Address</label>
                        <div className="relative">
                            <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold placeholder:text-slate-300 outline-none focus:border-blue-500 pr-10" value={newJob.address} onChange={handleAddressChange} placeholder="Street, City, Zip" autoComplete="off" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            </div>
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                                {suggestions.map((s, i) => (
                                    <button key={i} type="button" onClick={() => selectSuggestion(s)} className="w-full text-left p-3 text-xs font-bold hover:bg-blue-50 border-b border-slate-100 last:border-none text-slate-700 flex items-center gap-2">
                                        <MapPin size={12} className="text-blue-500 shrink-0" /><span className="truncate">{s}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Contract Value ($)</label>
                            <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:border-blue-500" type="number" value={newJob.value} onChange={e => setNewJob({ ...newJob, value: parseFloat(e.target.value) })} required />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Est. Duration</label>
                            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:border-blue-500" value={newJob.duration} onChange={e => setNewJob({ ...newJob, duration: parseInt(e.target.value) })}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(d => <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Market</label>
                            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:border-blue-500" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })}>
                                <option value="Louisville">Louisville</option>
                                <option value="Cincinnati">Cincinnati</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-1 block">Sub Region</label>
                            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:border-blue-500" value={newJob.subRegion} onChange={e => setNewJob({ ...newJob, subRegion: e.target.value })}>
                                <option value="Central">Central / South</option>
                                <option value="North">North (Traffic Buffer)</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={newJob.hasElectrical} onChange={e => setNewJob({ ...newJob, hasElectrical: e.target.checked })} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900 transition-colors">Needs Electrical / Fan Assy</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={newJob.complexity === 'Complex'} onChange={e => setNewJob({ ...newJob, complexity: e.target.checked ? 'Complex' : 'Standard' })} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900 transition-colors">Complex Carpentry Required</span>
                        </label>
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.02]">Create Entry</button>
                </form>
            </div>
        </div>
    );
};
