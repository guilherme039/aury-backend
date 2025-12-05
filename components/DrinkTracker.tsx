import React, { useState, useMemo } from 'react';
import { WaterDropIcon, PlusIcon, TrashIcon, ScaleIcon, ClockIcon } from './Icons';
import { WaterLogEntry } from '../types';

interface DrinkTrackerProps {
    currentIntake: number;
    goal: number;
    onAddWater: (amount: number) => void;
    onReset: () => void;
    waterLog: WaterLogEntry[];
    userWeight: number;
    onUpdateGoal: (newGoal: number) => void;
}

const DrinkTracker: React.FC<DrinkTrackerProps> = ({
    currentIntake,
    goal,
    onAddWater,
    onReset,
    waterLog,
    userWeight,
    onUpdateGoal
}) => {
    const [customAmount, setCustomAmount] = useState('');
    const [showCalculator, setShowCalculator] = useState(false);

    const percentage = Math.min((currentIntake / goal) * 100, 100);

    const recommendedGoal = Math.round(userWeight * 35);

    const todaysLog = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return waterLog
            .filter(entry => entry.timestamp >= todayStart.getTime())
            .sort((a, b) => b.timestamp - a.timestamp);
    }, [waterLog]);

    const handleAddCustom = () => {
        const amount = parseInt(customAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            onAddWater(amount);
            setCustomAmount('');
        }
    };

    const handleApplyRecommendation = () => {
        onUpdateGoal(recommendedGoal);
        setShowCalculator(false);
    };

    return (
        <div className="text-white p-2 space-y-6 animate-fade-in relative pb-20">
            <Header />

            {/* Main Water Display */}
            <div className="relative flex flex-col items-center justify-end w-48 h-96 mx-auto bg-[#1A1B1E]/80 border-2 border-blue-500/30 rounded-t-3xl rounded-b-xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Water Fill */}
                <div
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-700 ease-in-out"
                    style={{ height: `${percentage}%` }}
                >
                    <div className="absolute top-0 left-0 w-full h-4 bg-cyan-300/50 blur-md -translate-y-1/2 rounded-full wave-animation"></div>
                </div>

                {/* Text Overlay */}
                <div className="relative z-10 text-center mb-8">
                    <p className="text-5xl font-extrabold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {currentIntake}
                    </p>
                    <p className="text-lg text-blue-200/80">/ {goal} ml</p>
                </div>

                <style>{`
                    .wave-animation {
                        animation: wave 2.5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
                    }
                    @keyframes wave {
                        0% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
                        50% { transform: translateY(-50%) translateX(5px) rotate(3deg); }
                        100% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
                    }
                `}</style>
            </div>

            {/* Goal Calculator */}
            <div className="bg-[#1D1E22] rounded-xl p-4 border border-gray-800">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowCalculator(!showCalculator)}
                >
                    <div className="flex items-center gap-2 text-cyan-400">
                        <ScaleIcon className="w-5 h-5" />
                        <span className="font-semibold">Calculadora de Meta</span>
                    </div>
                    <span className="text-xs text-gray-500">{showCalculator ? 'Ocultar' : 'Expandir'}</span>
                </div>

                {showCalculator && (
                    <div className="mt-4 pt-4 border-t border-gray-800 space-y-3 animate-fade-in">
                        <p className="text-sm text-gray-400">
                            Com base no seu peso de <span className="text-white font-bold">{userWeight}kg</span>,
                            sua meta recomendada é (35ml/kg):
                        </p>
                        <div className="flex items-center justify-between bg-[#141416] p-3 rounded-lg">
                            <span className="text-xl font-bold text-white">{recommendedGoal} ml</span>
                            <button
                                onClick={handleApplyRecommendation}
                                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-lg hover:bg-cyan-500/30 transition-colors"
                            >
                                Aplicar Meta
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Add Controls */}
            <div className="space-y-4 relative">
                <p className="text-center text-gray-400 font-semibold">Adicionar Rápido</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => onAddWater(250)} className="bg-blue-500/20 border border-blue-500/30 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors">Copo (250ml)</button>
                    <button onClick={() => onAddWater(500)} className="bg-blue-500/20 border border-blue-500/30 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors">Garrafa (500ml)</button>
                </div>

                <div className="flex gap-2">
                    <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Outro valor (ml)"
                        className="flex-1 bg-[#1A1B1E]/80 border border-gray-700 rounded-xl px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button onClick={handleAddCustom} className="p-4 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hydration Diary */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-blue-400" />
                    Diário de Hoje
                </h3>

                {todaysLog.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 text-sm">Nenhum registro hoje.</p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {todaysLog.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center bg-[#1D1E22] p-3 rounded-xl border border-gray-800/50">
                                <span className="text-gray-400 font-mono text-sm">
                                    {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold">{entry.amount} ml</span>
                                    <WaterDropIcon className="w-4 h-4 text-blue-500/50" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {currentIntake > 0 && (
                <div className="flex justify-center pt-4">
                    <button onClick={onReset} className="flex items-center gap-1.5 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors duration-200 active:scale-95">
                        <TrashIcon className="w-4 h-4" /> Zerar Dia
                    </button>
                </div>
            )}
        </div>
    );
};

const Header = () => (
    <div className="flex items-center space-x-3 mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-700/50 to-cyan-800/50 shadow-inner">
            <WaterDropIcon className="w-6 h-6 text-cyan-300" />
        </div>
        <h1 className="text-3xl font-bold">Hidratação</h1>
    </div>
);

export default React.memo(DrinkTracker);
