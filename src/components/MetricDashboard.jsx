import { TrendingUp, ThermometerSnowflake, CloudRain, Wind, CheckCircle, Truck, AlertTriangle } from 'lucide-react';

export const MetricDashboard = ({ currentTotal, isFluffHeavy, weather, setWeather, setModals, modals }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Production Goal</span>
                    <TrendingUp size={18} className="text-emerald-500" />
                </div>
                <div className="text-4xl font-black text-slate-800">${currentTotal.toLocaleString()}</div>
                <div className="mt-4 h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ${currentTotal >= 45000 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min((currentTotal / 45000) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Target: $45k</span>
                    <span className={currentTotal >= 45000 ? 'text-emerald-500' : ''}>
                        {Math.round((currentTotal / 45000) * 100)}%
                    </span>
                </div>
                {isFluffHeavy && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700">
                        <AlertTriangle size={18} />
                        <span className="text-[10px] font-black uppercase leading-tight">Mix Warning: High density of low-value jobs.</span>
                    </div>
                )}
            </div>

            <div className="md:col-span-5 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Weather Dependencies</span>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { key: 'isFreezing', label: '15°F Rule', icon: <ThermometerSnowflake size={20} />, color: 'bg-red-500' },
                        { key: 'isRaining', label: 'Rain Alert', icon: <CloudRain size={20} />, color: 'bg-blue-500' },
                        { key: 'isWindy', label: 'High Wind', icon: <Wind size={20} />, color: 'bg-teal-500' }
                    ].map(w => (
                        <button
                            key={w.key}
                            onClick={() => setWeather({ ...weather, [w.key]: !weather[w.key] })}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${weather[w.key] ? `${w.color} text-white border-transparent shadow-lg` : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'}`}
                        >
                            {w.icon}
                            <span className="text-[9px] font-black uppercase tracking-tighter">{w.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:col-span-3 bg-slate-900 p-6 rounded-[2rem] shadow-xl flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Fleet Monitor</span>
                <div className="space-y-3 my-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                        <CheckCircle size={14} className="text-emerald-500" /> Lead Foremen Ready
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                        <Truck size={14} className="text-blue-500" /> Cincy North Traffic Active
                    </div>
                </div>
                <button
                    onClick={() => setModals({ ...modals, settings: true })}
                    className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    Crew Management
                </button>
            </div>
        </div>
    );
};
