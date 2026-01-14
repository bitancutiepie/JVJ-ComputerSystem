import React, { useState, useEffect } from 'react';
import { Scale, Ruler, ArrowRightLeft, RefreshCw } from 'lucide-react';

export const WeightHeightCalculator: React.FC = () => {
    // Height State
    const [ft, setFt] = useState<string>('');
    const [inch, setInch] = useState<string>('');
    const [cm, setCm] = useState<string>('');

    // Weight State
    const [kg, setKg] = useState<string>('');
    const [lbs, setLbs] = useState<string>('');

    // Height Conversions
    const convertFtInToCm = () => {
        const feet = parseFloat(ft) || 0;
        const inches = parseFloat(inch) || 0;
        const totalInches = (feet * 12) + inches;
        const centimeters = totalInches * 2.54;
        setCm(centimeters > 0 ? centimeters.toFixed(2) : '');
    };

    const convertCmToFtIn = () => {
        const centimeters = parseFloat(cm) || 0;
        const totalInches = centimeters / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        setFt(centimeters > 0 ? feet.toString() : '');
        setInch(centimeters > 0 ? inches.toFixed(1) : '');
    };

    // Weight Conversions
    const convertKgToLbs = () => {
        const kilograms = parseFloat(kg) || 0;
        const pounds = kilograms * 2.20462;
        setLbs(kilograms > 0 ? pounds.toFixed(2) : '');
    };

    const convertLbsToKg = () => {
        const pounds = parseFloat(lbs) || 0;
        const kilograms = pounds / 2.20462;
        setKg(pounds > 0 ? kilograms.toFixed(2) : '');
    };

    const resetAll = () => {
        setFt('');
        setInch('');
        setCm('');
        setKg('');
        setLbs('');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Height Module */}
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                        <Ruler className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Height Converter</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Feet (ft)</label>
                                <input
                                    type="number"
                                    value={ft}
                                    onChange={(e) => setFt(e.target.value)}
                                    placeholder="5"
                                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Inches (in)</label>
                                <input
                                    type="number"
                                    value={inch}
                                    onChange={(e) => setInch(e.target.value)}
                                    placeholder="5"
                                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={convertFtInToCm}
                            className="w-full py-3 bg-white border border-slate-200 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                            Convert to CM <ArrowRightLeft className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="hidden md:flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Centimeters (cm)</label>
                            <input
                                type="number"
                                value={cm}
                                onChange={(e) => setCm(e.target.value)}
                                placeholder="165.1"
                                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={convertCmToFtIn}
                            className="w-full py-3 bg-white border border-slate-200 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                            Convert to FT/IN <ArrowRightLeft className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weight Module */}
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Weight Converter</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kilograms (kg)</label>
                            <input
                                type="number"
                                value={kg}
                                onChange={(e) => setKg(e.target.value)}
                                placeholder="70"
                                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={convertKgToLbs}
                            className="w-full py-3 bg-white border border-slate-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                        >
                            Convert to LBS <ArrowRightLeft className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="hidden md:flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pounds (lbs)</label>
                            <input
                                type="number"
                                value={lbs}
                                onChange={(e) => setLbs(e.target.value)}
                                placeholder="154.3"
                                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={convertLbsToKg}
                            className="w-full py-3 bg-white border border-slate-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                        >
                            Convert to KG <ArrowRightLeft className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={resetAll}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
            >
                <RefreshCw className="w-4 h-4" /> Clear All Values
            </button>
        </div>
    );
};
