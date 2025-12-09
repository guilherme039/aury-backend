import React, { useState, useRef } from 'react';
import { Meal, DailyGoals, NutritionInfo } from '../types';
import CircularProgress from './CircularProgress';
import MealCard from './MealCard';
import { ProteinGradientIcon, CarbsGradientIcon, FatGradientIcon, FireIcon, BrainIcon, TrashIcon, SettingsIcon, BarcodeIcon, PencilIcon } from './Icons';
import AnimatedCounter from './AnimatedCounter';

interface DashboardProps {
  meals: Meal[];
  goals: DailyGoals;
  onUpdateGoals: (updatedGoals: Partial<DailyGoals>) => void;
  totals: NutritionInfo;
  activeDay: 'Hoje' | 'Ontem';
  setActiveDay: (day: 'Hoje' | 'Ontem') => void;
  onSelectMeal: (meal: Meal) => void;
  onClearHistory: () => void;
  onGoToSettings: () => void;
}

interface BarcodeScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroCardProps {
  value: number;
  goal: number;
  label: string;
  icon: React.ReactNode;
  onEdit?: () => void;
}

const MacroCard: React.FC<MacroCardProps> = ({ value, goal, label, icon, onEdit }) => (
  <div className="premium-card p-4 flex flex-col items-center justify-center space-y-3 relative group transition-all duration-300 hover:border-cyan-500/30">
    <div className="icon-box w-12 h-12 rounded-full">
      {icon}
    </div>
    <div className="text-center z-10">
      <div className="flex items-center justify-center gap-1">
        <p className="text-xl font-bold text-white">
          {Math.round(value)}
          <span className="text-base font-normal text-gray-500">/{goal}g</span>
        </p>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 rounded-full text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label={`Editar meta de ${label}`}
          >
            <PencilIcon className="w-3 h-3" />
          </button>
        )}
      </div>
      <p className="text-label mt-1">{label}</p>
    </div>
  </div>
);

const AIInsightCard = () => (
  <div className="premium-card p-4 flex items-center space-x-4 border-l-4 border-l-cyan-500 bg-gradient-to-r from-cyan-900/10 to-transparent">
    <div className="p-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
      <BrainIcon className="w-6 h-6 text-cyan-400" />
    </div>
    <div>
      <p className="font-semibold text-sm text-gray-200">Seu consumo de proteína aumentou 18% esta semana 💪</p>
      <p className="text-xs text-gray-500 mt-0.5">Continue com o ótimo trabalho!</p>
    </div>
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ meals, goals, onUpdateGoals, totals, activeDay, setActiveDay, onSelectMeal, onClearHistory, onGoToSettings }) => {
  const caloriesLeft = Math.max(0, goals.calories - totals.calories);
  const calorieProgress = goals.calories > 0 ? (totals.calories / goals.calories) * 100 : 0;

  // State for barcode scanner
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<BarcodeScanResult | null>(null);

  // New state and logic for the secret button
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const longPressTimer = useRef<number | null>(null);

  // State for calorie goal modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newCalorieGoal, setNewCalorieGoal] = useState(goals.calories);

  // State for protein goal modal
  const [isProteinGoalModalOpen, setIsProteinGoalModalOpen] = useState(false);
  const [newProteinGoal, setNewProteinGoal] = useState(goals.protein);

  const handlePressStart = () => {
    // Prevent context menu on long press
    window.addEventListener('contextmenu', (e) => e.preventDefault(), { once: true });
    longPressTimer.current = window.setTimeout(() => {
      setIsBarcodeVisible(true);
    }, 700); // 700ms for long press
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    // 2.5 second scan simulation
    setTimeout(() => {
      setScanResult({
        name: 'Barra de Cereal Nesfit',
        calories: 127,
        protein: 3,
        carbs: 21,
        fat: 3,
      });
    }, 2500);
  };

  const closeScanner = () => {
    setIsScanning(false);
    setScanResult(null);
    // Also hide the button again after use
    setIsBarcodeVisible(false);
  };

  const handleSaveCalorieGoal = () => {
    if (newCalorieGoal > 0) {
      onUpdateGoals({ calories: newCalorieGoal });
      setIsGoalModalOpen(false);
    }
  };

  const handleSaveProteinGoal = () => {
    if (newProteinGoal > 0) {
      onUpdateGoals({ protein: newProteinGoal });
      setIsProteinGoalModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="px-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={() => setActiveDay('Hoje')} className={`text-2xl font-bold transition-all duration-300 ${activeDay === 'Hoje' ? 'text-white scale-105' : 'text-gray-600 hover:text-gray-400'}`}>Hoje</button>
            <div className="h-6 w-px bg-gray-800"></div>
            <button onClick={() => setActiveDay('Ontem')} className={`text-2xl font-bold transition-all duration-300 ${activeDay === 'Ontem' ? 'text-white scale-105' : 'text-gray-600 hover:text-gray-400'}`}>Ontem</button>
          </div>
          <button onClick={onGoToSettings} className="p-3 rounded-full bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white transition-colors duration-300 hover:border-gray-600">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="space-y-6">
        {/* Main Calorie Card */}
        <div className="premium-card p-6 flex items-center justify-between relative overflow-visible">
          <div className="flex flex-col z-10 space-y-1">
            <p className="text-label flex items-center gap-2">
              Restantes hoje
              <PencilIcon
                className="w-3 h-3 text-gray-600 cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => { setNewCalorieGoal(goals.calories); setIsGoalModalOpen(true); }}
              />
            </p>
            <div className="text-value-xl">
              <AnimatedCounter from={caloriesLeft + 50} to={caloriesLeft} />
            </div>
            <p className="text-gray-500 text-sm font-medium">de {goals.calories} kcal</p>
          </div>

          <div className="relative">
            {/* Glow effect behind ring */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full transform scale-150"></div>
            <div className="relative z-10 pulse">
              <CircularProgress
                percentage={calorieProgress}
                size={120}
                strokeWidth={10}
                gradient={{ id: 'calories', from: '#06b6d4', to: '#3b82f6' }}
                trailColor="rgba(255,255,255,0.05)"
                centerIcon={<FireIcon className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
              />
            </div>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="grid grid-cols-3 gap-4">
          <MacroCard
            value={totals.protein}
            goal={goals.protein}
            label="Proteína"
            icon={<ProteinGradientIcon className="w-6 h-6" />}
            onEdit={() => { setNewProteinGoal(goals.protein); setIsProteinGoalModalOpen(true); }}
          />
          <MacroCard
            value={totals.carbs}
            goal={goals.carbs}
            label="Carbos"
            icon={<CarbsGradientIcon className="w-6 h-6" />}
          />
          <MacroCard
            value={totals.fat}
            goal={goals.fat}
            label="Gorduras"
            icon={<FatGradientIcon className="w-6 h-6" />}
          />
        </div>

        <AIInsightCard />

        <div>
          <div
            className="flex justify-between items-center mb-4 select-none"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
          >
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-300">Adicionado Recentemente</h3>
              {isBarcodeVisible && (
                <button
                  onClick={startScan}
                  className="p-2 ml-2 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:border-cyan-500 transition-all duration-300 animate-secret-button"
                  style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}
                  aria-label="Leitor de Código de Barras"
                >
                  <BarcodeIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {meals.length > 0 && (
              <button onClick={onClearHistory} className="flex items-center gap-1.5 text-gray-500 px-2.5 py-1 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 active:scale-95">
                <TrashIcon className="w-4 h-4" />
                Limpar
              </button>
            )}
          </div>
          {meals.length > 0 ? (
            <div className="space-y-4">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onClick={() => onSelectMeal(meal)} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 px-4 bg-[#1A1A1D] rounded-2xl border border-gray-800">
              <p className="font-semibold">Nenhuma refeição registrada para {activeDay.toLowerCase()}.</p>
              {activeDay === 'Hoje' && <p className="text-sm mt-2">Toque no botão '+' para adicionar sua primeira refeição!</p>}
            </div>
          )}
        </div>
      </main>

      {isScanning && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[60]" onClick={closeScanner}>
          <div className="w-full max-w-sm h-48 relative overflow-hidden rounded-lg">
            <div className="absolute top-0 left-0 w-full h-full scan-line"></div>
          </div>
          {!scanResult && <p className="mt-4 text-lg">Escaneando...</p>}

          {scanResult && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg p-4 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-blue-500/20 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{scanResult.name}</h3>
                  <p className="text-5xl font-bold my-1">{scanResult.calories} <span className="text-2xl text-gray-400 font-medium">kcal</span></p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700/50">
                  <div className="flex flex-col items-center">
                    <ProteinGradientIcon className="w-7 h-7 mb-1" />
                    <span className="font-bold text-lg">{scanResult.protein}g</span>
                    <span className="text-xs text-gray-400">Proteína</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CarbsGradientIcon className="w-7 h-7 mb-1" />
                    <span className="font-bold text-lg">{scanResult.carbs}g</span>
                    <span className="text-xs text-gray-400">Carbos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FatGradientIcon className="w-7 h-7 mb-1" />
                    <span className="font-bold text-lg">{scanResult.fat}g</span>
                    <span className="text-xs text-gray-400">Gordura</span>
                  </div>
                </div>
                <button onClick={closeScanner} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">Fechar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A1B1E] rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Atualizar Meta de Calorias</h3>
            <div className="flex gap-2 mb-4">
              {[2000, 2200, 2500].map(val => (
                <button
                  key={val}
                  onClick={() => setNewCalorieGoal(val)}
                  className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-colors ${newCalorieGoal === val ? 'bg-blue-600 text-white' : 'bg-gray-700/80 hover:bg-gray-600'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={newCalorieGoal}
                onChange={(e) => setNewCalorieGoal(Number(e.target.value))}
                className="w-full bg-[#0C0C0E] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 pr-12 text-center text-xl font-bold"
                autoFocus
                onFocus={e => e.target.select()}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCalorieGoal()}
              />
              <span className="absolute right-3 top-2.5 text-gray-500">kcal</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsGoalModalOpen(false)} className="flex-1 bg-gray-700/80 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Cancelar</button>
              <button
                onClick={handleSaveCalorieGoal}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {isProteinGoalModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A1B1E] rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Atualizar Meta de Proteína</h3>
            <div className="relative">
              <input
                type="number"
                value={newProteinGoal}
                onChange={(e) => setNewProteinGoal(Number(e.target.value))}
                className="w-full bg-[#0C0C0E] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 pr-12 text-center text-xl font-bold"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveProteinGoal()}
              />
              <span className="absolute right-3 top-2.5 text-gray-500">g</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsProteinGoalModalOpen(false)} className="flex-1 bg-gray-700/80 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Cancelar</button>
              <button
                onClick={handleSaveProteinGoal}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Dashboard);