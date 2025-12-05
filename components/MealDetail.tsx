import React, { useState } from 'react';
import { Meal, DetectedFood } from '../types';
import { ArrowLeftIcon, HeartIcon, ProteinGradientIcon, CarbsGradientIcon, FatGradientIcon, TrashIcon, FireIcon, BrainIcon, ShieldCheckIcon } from './Icons';
import MultiArcCircularProgress from './MultiArcCircularProgress';

interface MealDetailProps {
    meal: Meal;
    onBack: () => void;
    onDelete: (mealId: number) => void;
}

const MealDetail: React.FC<MealDetailProps> = ({ meal, onBack, onDelete }) => {
    const [hoveredFoodId, setHoveredFoodId] = useState<string | null>(null);

    const handleDelete = () => {
        if (window.confirm('Tem certeza de que deseja excluir esta refeição?')) {
            onDelete(meal.id);
        }
    };

    const hasDetailedView = meal.detectedFoods && meal.detectedFoods.length > 0;

    return (
        <div className="min-h-screen bg-[#0C0C0E] text-white -m-4 pb-32">
            <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
                <button onClick={onBack} className="p-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex-grow"></div> {/* Spacer to push back button left */}
            </header>

            <main className="flex flex-col h-full">
                {hasDetailedView ? (
                    <InteractiveView meal={meal} hoveredFoodId={hoveredFoodId} setHoveredFoodId={setHoveredFoodId} />
                ) : (
                    <ClassicView meal={meal} />
                )}
            </main>

            <footer className="p-4 fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E] to-transparent">
                <div className="container mx-auto max-w-lg">
                    <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-2 bg-red-900/40 border border-red-500/50 text-red-300 font-bold py-3 rounded-xl hover:bg-red-800/50 hover:border-red-500 transition-colors duration-200"
                    >
                        <TrashIcon className="w-5 h-5" />
                        Excluir Refeição
                    </button>
                </div>
            </footer>
        </div>
    );
};


const InteractiveView: React.FC<{ meal: Meal, hoveredFoodId: string | null, setHoveredFoodId: (id: string | null) => void }> = ({ meal, hoveredFoodId, setHoveredFoodId }) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Image Panel - Prominent at the top */}
            <div className="w-full h-80 flex-shrink-0 relative px-4">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800">
                    <img src={meal.imageUrl} alt="Refeição analisada" className="w-full h-full object-cover" />
                    {meal.detectedFoods?.map((food, index) => {
                        const foodId = `${food.foodName}-${index}`;
                        if (!food.boundingBox) return null; // Skip if no bounding box
                        return (
                            <div
                                key={foodId}
                                onMouseEnter={() => setHoveredFoodId(foodId)}
                                onMouseLeave={() => setHoveredFoodId(null)}
                                className={`absolute border-2 rounded-lg transition-all duration-300 pointer-events-auto ${hoveredFoodId === foodId ? 'border-cyan-400 bg-cyan-400/30' : 'border-cyan-400/0 bg-transparent'}`}
                                style={{
                                    left: `${food.boundingBox.x1 * 100}%`,
                                    top: `${food.boundingBox.y1 * 100}%`,
                                    width: `${(food.boundingBox.x2 - food.boundingBox.x1) * 100}%`,
                                    height: `${(food.boundingBox.y2 - food.boundingBox.y1) * 100}%`,
                                }}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Details Panel - Scrollable content below the image */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Title Block */}
                <div className="px-1">
                    <h1 className="text-2xl font-bold text-white leading-tight">{meal.name}</h1>
                    <p className="text-sm text-gray-400">às {meal.time}</p>
                </div>

                {/* Total Summary */}
                <div className="bg-[#1A1B1E] p-4 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span className="font-semibold text-base text-gray-200">Total da Refeição</span>
                        <div className="flex items-center gap-1.5 font-bold text-base text-white">
                            <FireIcon className="w-5 h-5 text-orange-400" />
                            {Math.round(meal.nutrition.calories)} kcal
                        </div>
                    </div>
                </div>

                {/* Individual Food Cards */}
                {meal.detectedFoods?.map((food, index) => {
                    const foodId = `${food.foodName}-${index}`;
                    return (
                        <div key={foodId} className="animate-slide-up opacity-0" style={{ animationDelay: `${index * 100}ms` }}>
                            <ReadOnlyFoodItemCard
                                food={food}
                                foodId={foodId}
                                isHovered={hoveredFoodId === foodId}
                                onHover={setHoveredFoodId}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ReadOnlyFoodItemCard: React.FC<{
    food: DetectedFood;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    foodId: string;
}> = ({ food, isHovered, onHover, foodId }) => {
    const confidenceColor = food.confidenceScore > 0.85 ? 'text-green-400' : food.confidenceScore > 0.7 ? 'text-yellow-400' : 'text-red-400';
    return (
        <div
            onMouseEnter={() => onHover(foodId)}
            onMouseLeave={() => onHover(null)}
            className={`bg-[#1A1B1E] p-4 rounded-2xl border transition-all duration-300 ${isHovered ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-gray-800'}`}
        >
            {/* Card Header */}
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-bold text-white">{food.foodName}</h4>
                    <p className="text-xs text-gray-400 -mt-0.5">{Math.round(food.weightGrams)}g ・ {Math.round(food.calories)} kcal</p>
                </div>
                <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold ${confidenceColor}`}>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>{(food.confidenceScore * 100).toFixed(0)}%</span>
                </div>
            </div>

            {/* Tighter Macro Grid */}
            <div className="mt-3 grid grid-cols-3 gap-3 text-center border-t border-gray-800 pt-3">
                <div>
                    <p className="text-xs text-gray-400">Proteína</p>
                    <p className="font-bold text-red-400/90">{(food.protein || 0).toFixed(1)}g</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Carbos</p>
                    <p className="font-bold text-yellow-400/90">{(food.carbs || 0).toFixed(1)}g</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Gordura</p>
                    <p className="font-bold text-blue-400/90">{(food.fat || 0).toFixed(1)}g</p>
                </div>
            </div>

            {/* Suggestion */}
            {food.adjustmentSuggestion && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-start gap-2 text-xs text-gray-400">
                    <BrainIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p>{food.adjustmentSuggestion}</p>
                </div>
            )}
        </div>
    );
};


const ClassicView: React.FC<{ meal: Meal }> = ({ meal }) => {
    const { calories, protein, carbs, fat } = meal.nutrition;
    const totalMacrosInKcal = (protein * 4) + (carbs * 4) + (fat * 9);
    const safeTotal = totalMacrosInKcal > 0 ? totalMacrosInKcal : 1;
    const segments = [
        { value: (protein * 4) / safeTotal * 100, color: '#F43F5E' },
        { value: (carbs * 4) / safeTotal * 100, color: '#F59E0B' },
        { value: (fat * 9) / safeTotal * 100, color: '#22C55E' },
    ];

    const idealProtein = 0.3, idealCarbs = 0.4, idealFat = 0.3;
    const proteinDiff = Math.abs(((protein * 4) / safeTotal) - idealProtein);
    const carbsDiff = Math.abs(((carbs * 4) / safeTotal) - idealCarbs);
    const fatDiff = Math.abs(((fat * 9) / safeTotal) - idealFat);
    const totalDiff = proteinDiff + carbsDiff + fatDiff;
    const healthScore = Math.max(0, 10 * (1 - totalDiff / 1.4)); // 1.4 is a normalization factor

    return (
        <>
            <div className="h-80 w-full">
                <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 p-6 space-y-4 rounded-t-3xl -mt-8 bg-[#0C0C0E]">
                {/* Title Block */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white leading-tight">{meal.name}</h1>
                    <p className="text-sm text-gray-400">às {meal.time}</p>
                </div>

                <div className="bg-[#1A1A1D] border border-gray-800/50 p-6 rounded-2xl flex items-center justify-around">
                    <div className="relative">
                        <MultiArcCircularProgress segments={segments} size={140} strokeWidth={16} trailColor="#0C0C0E" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{Math.round(calories)}</span>
                            <span className="text-[#9CA3AF]">kcal</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#1A1A1D] border border-gray-800/50 p-4 rounded-2xl text-center space-y-2">
                        <ProteinGradientIcon className="w-8 h-8 mx-auto" />
                        <p className="font-bold text-lg">{protein}g</p>
                        <p className="text-xs text-[#9CA3AF]">Proteína</p>
                    </div>
                    <div className="bg-[#1A1A1D] border border-gray-800/50 p-4 rounded-2xl text-center space-y-2">
                        <CarbsGradientIcon className="w-8 h-8 mx-auto" />
                        <p className="font-bold text-lg">{carbs}g</p>
                        <p className="text-xs text-[#9CA3AF]">Carbos</p>
                    </div>
                    <div className="bg-[#1A1A1D] border border-gray-800/50 p-4 rounded-2xl text-center space-y-2">
                        <FatGradientIcon className="w-8 h-8 mx-auto" />
                        <p className="font-bold text-lg">{fat}g</p>
                        <p className="text-xs text-[#9CA3AF]">Gorduras</p>
                    </div>
                </div>

                <div className="bg-[#1A1A1D] border border-gray-800/50 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                            <HeartIcon className="w-5 h-5 text-pink-500" />
                            <span className="font-semibold">Pontuação de Saúde</span>
                        </div>
                        <span className="font-bold text-lg">{healthScore.toFixed(1)}<span className="text-sm text-[#9CA3AF]">/10</span></span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${healthScore * 10}%` }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(MealDetail);
