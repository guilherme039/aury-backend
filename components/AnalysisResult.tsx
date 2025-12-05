import React, { useState, useMemo, useEffect } from 'react';
import { ScanResult, DetectedFood, NutritionInfo } from '../types';
import { ArrowLeftIcon, FireIcon, ProteinGradientIcon, CarbsGradientIcon, FatGradientIcon, ShieldCheckIcon, BrainIcon, ChevronDownIcon, ChevronUpIcon, ChickenLegIcon, BreadIcon, ButterIcon } from './Icons';

interface EditableFood extends DetectedFood {
    id: string;
    nutritionPerGram: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

interface AnalysisResultProps {
    scanResult: ScanResult;
    imageUrl: string;
    onAddMeal: (meal: { name: string; nutrition: NutritionInfo; detectedFoods: DetectedFood[] }) => void;
    onScanAgain: () => void;
}

interface FoodItemCardProps {
    food: EditableFood;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    onWeightChange: (id: string, weight: number) => void;
    isVisible: boolean;
}

interface MacroBarProps {
    icon: React.ReactNode;
    value: number;
    percentage: number;
    gradient: string;
    isVisible: boolean;
}

const MacroBar: React.FC<MacroBarProps> = React.memo(({ icon, value, percentage, gradient, isVisible }) => (
    <div className="flex items-center gap-3">
        {icon}
        <div className="w-20 text-right font-extrabold text-xl text-gray-300" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{value.toFixed(1)}g</div>
        <div className="flex-1 bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`} style={{ width: isVisible ? `${percentage}%` : '0%' }}></div>
        </div>
        <div className="w-12 text-right font-mono text-gray-500">{percentage.toFixed(0)}%</div>
    </div>
));

const FoodItemCard: React.FC<FoodItemCardProps> = React.memo(({ food, isHovered, onHover, onWeightChange, isVisible }) => {

    const totalMacros = food.protein + food.carbs + food.fat || 1;
    const proteinPercent = (food.protein / totalMacros) * 100;
    const carbsPercent = (food.carbs / totalMacros) * 100;
    const fatPercent = (food.fat / totalMacros) * 100;

    const confidenceColor = food.confidenceScore > 0.85 ? 'text-green-400' : food.confidenceScore > 0.7 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div
            onMouseEnter={() => onHover(food.id)}
            onMouseLeave={() => onHover(null)}
            className={`p-4 rounded-2xl border border-transparent transition-all duration-300 relative bg-[#1D1E22] bg-clip-padding before:content-[''] before:absolute before:inset-0 before:z-[-1] before:m-[-1px] before:rounded-[17px] before:bg-gradient-to-br before:from-blue-500/30 before:to-cyan-400/30 ${isHovered ? 'shadow-lg shadow-cyan-500/10' : ''}`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-white pr-2">{food.foodName}</h4>
                <div className={`flex items-center gap-1 text-xs font-semibold ${confidenceColor}`}>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>{(food.confidenceScore * 100).toFixed(0)}%</span>
                </div>
            </div>
            {/* FIX: Increased font size and emphasis */}
            <p className="text-2xl font-extrabold text-orange-400/90 -mt-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{Math.round(food.calories)} kcal</p>

            <div className="mt-3">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                    <label htmlFor={`weight-${food.id}`}>Peso</label>
                    <span className="font-semibold text-white text-lg">{Math.round(food.weightGrams)}g</span>
                </div>
                <input
                    id={`weight-${food.id}`}
                    type="range"
                    min={Math.max(1, food.weightGrams * 0.2)}
                    max={food.weightGrams * 2}
                    step="1"
                    value={food.weightGrams}
                    onChange={e => onWeightChange(food.id, parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm accent-cyan-500"
                />
            </div>

            <div className="mt-4 space-y-2.5">
                <MacroBar icon={<ProteinGradientIcon className="w-5 h-5" />} value={food.protein} percentage={proteinPercent} gradient="from-red-500 to-orange-500" isVisible={isVisible} />
                <MacroBar icon={<CarbsGradientIcon className="w-5 h-5" />} value={food.carbs} percentage={carbsPercent} gradient="from-yellow-500 to-amber-400" isVisible={isVisible} />
                <MacroBar icon={<FatGradientIcon className="w-5 h-5" />} value={food.fat} percentage={fatPercent} gradient="from-cyan-500 to-green-500" isVisible={isVisible} />
            </div>

            {food.adjustmentSuggestion && (
                <div className="mt-4 pt-3 border-t border-gray-800/50 flex items-center gap-2 text-xs text-gray-400">
                    <BrainIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <p>{food.adjustmentSuggestion}</p>
                </div>
            )}
        </div>
    );
});

const AnalysisResult: React.FC<AnalysisResultProps> = ({ scanResult, imageUrl, onAddMeal, onScanAgain }) => {
    const initialFoods = useMemo(() => (scanResult.detectedFoods || []).map((food, index) => ({
        ...food,
        id: `${food.foodName}-${index}`,
        nutritionPerGram: {
            calories: food.calories / (food.weightGrams || 1),
            protein: food.protein / (food.weightGrams || 1),
            carbs: food.carbs / (food.weightGrams || 1),
            fat: food.fat / (food.weightGrams || 1),
        }
    })), [scanResult]);

    const [foods, setFoods] = useState<EditableFood[]>(initialFoods);

    console.log("AnalysisResult rendering with:", { scanResult, foodsCount: foods.length });

    // Use the total from the API as the source of truth, or calculate if missing.
    const [mealTotals, setMealTotals] = useState<NutritionInfo>(
        scanResult.totalNutrition || initialFoods.reduce((totals, food) => {
            totals.calories += food.calories;
            totals.protein += food.protein;
            totals.carbs += food.carbs;
            totals.fat += food.fat;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    );

    const [hoveredFoodId, setHoveredFoodId] = useState<string | null>(null);
    const [activeTouchFoodId, setActiveTouchFoodId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const touchTimeoutRef = React.useRef<number | null>(null);

    // Recalculate totals whenever the user adjusts an item's weight.
    useEffect(() => {
        const newTotals = foods.reduce((totals, food) => {
            totals.calories += food.calories;
            totals.protein += food.protein;
            totals.carbs += food.carbs;
            totals.fat += food.fat;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        setMealTotals(newTotals);
    }, [foods]);

    useEffect(() => {
        return () => {
            if (touchTimeoutRef.current) {
                clearTimeout(touchTimeoutRef.current);
            }
        }
    }, [])

    const handleWeightChange = (foodId: string, newWeight: number) => {
        setFoods(prevFoods => prevFoods.map(food => {
            if (food.id === foodId) {
                return {
                    ...food,
                    weightGrams: newWeight,
                    calories: food.nutritionPerGram.calories * newWeight,
                    protein: food.nutritionPerGram.protein * newWeight,
                    carbs: food.nutritionPerGram.carbs * newWeight,
                    fat: food.nutritionPerGram.fat * newWeight,
                };
            }
            return food;
        }));
    };

    const handleAddClick = () => {
        onAddMeal({
            name: scanResult.mealName,
            nutrition: mealTotals,
            detectedFoods: foods,
        });
    };

    const handleTouchFood = (foodId: string) => {
        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
        }
        setActiveTouchFoodId(foodId);
        touchTimeoutRef.current = window.setTimeout(() => {
            setActiveTouchFoodId(null);
        }, 2000); // Disappears after 2 seconds
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#0C0C0E]">
            <header className="flex-shrink-0 p-4 flex items-center gap-4 border-b border-gray-800">
                <button onClick={onScanAgain} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-white">NutriScan</h2>
                    <p className="text-sm text-gray-400">Ajuste os pesos e adicione sua refeição</p>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto min-h-0">
                {/* Image Panel */}
                <div className="lg:w-1/2 relative flex-shrink-0 p-4 group">
                    <div className="relative w-full h-full aspect-square max-h-[50vh] lg:max-h-full mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800">
                        <img src={imageUrl} alt="Refeição analisada" className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none p-8">
                            <div className="text-center">
                                <p className="text-6xl font-extrabold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{Math.round(mealTotals.calories)}</p>
                                <p className="text-xl -mt-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>kcal</p>
                            </div>
                        </div>

                        {foods.map(food => {
                            const isVisible = hoveredFoodId === food.id || activeTouchFoodId === food.id;
                            return (
                                <div
                                    key={food.id}
                                    onMouseEnter={() => setHoveredFoodId(food.id)}
                                    onMouseLeave={() => setHoveredFoodId(null)}
                                    onClick={() => handleTouchFood(food.id)}
                                    className="absolute rounded-lg transition-all duration-300 pointer-events-auto cursor-pointer"
                                    style={{
                                        left: `${(food.boundingBox?.x1 || 0) * 100}%`,
                                        top: `${(food.boundingBox?.y1 || 0) * 100}%`,
                                        width: `${((food.boundingBox?.x2 || 0) - (food.boundingBox?.x1 || 0)) * 100}%`,
                                        height: `${((food.boundingBox?.y2 || 0) - (food.boundingBox?.y1 || 0)) * 100}%`,
                                        display: food.boundingBox ? 'block' : 'none'
                                    }}
                                >
                                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 shadow-lg text-white text-center text-xs transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                        <p className="font-bold whitespace-nowrap">{food.foodName}</p>
                                        <p className="whitespace-nowrap">{Math.round(food.calories)} kcal</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="lg:w-1/2 flex flex-col min-h-0">
                    <div className="p-4 border-b border-gray-800">
                        <h3 className="text-2xl font-bold truncate text-white" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>{scanResult.mealName}</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between text-gray-400">
                                <span className="text-base font-semibold text-gray-300">Total da Refeição</span>
                                <div className="flex items-center gap-1.5 font-extrabold text-3xl text-white" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                    <FireIcon className="w-7 h-7 text-orange-400" />
                                    {Math.round(mealTotals.calories)} kcal
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-1 text-gray-300 px-1">
                                <span className="flex items-center gap-1.5 text-xl font-extrabold"><ChickenLegIcon className="w-5 h-5 text-red-400/90" /> {mealTotals.protein.toFixed(0)}g <span className="text-sm font-medium text-gray-500">P</span></span>
                                <span className="flex items-center gap-1.5 text-xl font-extrabold"><BreadIcon className="w-5 h-5 text-yellow-400/90" /> {mealTotals.carbs.toFixed(0)}g <span className="text-sm font-medium text-gray-500">C</span></span>
                                <span className="flex items-center gap-1.5 text-xl font-extrabold"><ButterIcon className="w-5 h-5 text-blue-400/90" /> {mealTotals.fat.toFixed(0)}g <span className="text-sm font-medium text-gray-500">F</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 pt-2">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-sm text-cyan-400 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            {isExpanded ? 'Recolher Detalhes' : 'Ver Detalhes'}
                            {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className={`space-y-4 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0 max-h-0 invisible'}`}>
                        <div className="p-4 pt-0 space-y-4">
                            {foods.map(food => (
                                <FoodItemCard
                                    key={food.id}
                                    food={food}
                                    isHovered={hoveredFoodId === food.id}
                                    onHover={setHoveredFoodId}
                                    onWeightChange={handleWeightChange}
                                    isVisible={isExpanded}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="flex-shrink-0 p-4 bg-[#141416] border-t border-gray-800 flex items-center gap-4">
                <button onClick={onScanAgain} className="flex-1 bg-gray-700/80 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors border border-gray-600">
                    Escanear Outra
                </button>
                <button onClick={handleAddClick} className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors glow-button pulse">
                    <span className="glow-button-inner">Adicionar</span>
                </button>
            </footer>
        </div>
    );
};

export default React.memo(AnalysisResult);