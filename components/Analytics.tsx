import React, { useState, useEffect } from 'react';
import { BrainIcon, AnalyticsGradientIcon, ClipboardListIcon } from './Icons';
import { Meal, DailyGoals, MealPlan, WaterLogEntry } from '../types';

// Mock functions to replace removed service exports
const generateMealPlan = async (goals: DailyGoals): Promise<MealPlan> => {
    return {
        breakfast: [{ name: "Aveia com Frutas", calories: 300, protein: 10, carbs: 50, fat: 5 }],
        lunch: [{ name: "Frango Grelhado com Salada", calories: 500, protein: 40, carbs: 10, fat: 20 }],
        dinner: [{ name: "Peixe Assado com Legumes", calories: 400, protein: 35, carbs: 5, fat: 15 }],
        snacks: [{ name: "Iogurte Natural", calories: 150, protein: 10, carbs: 10, fat: 5 }]
    };
};

const performComplexQuery = async (prompt: string): Promise<string> => {
    return "Insight da IA: Mantenha-se hidratado e focado nas proteínas! (Funcionalidade em migração para Python)";
};

interface AnalyticsProps {
    meals: Meal[];
    goals: DailyGoals;
    waterLog: WaterLogEntry[];
}

const getWeekData = (meals: Meal[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = Array(7).fill(0).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return {
            day: day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
            totalCalories: 0
        };
    });

    meals.forEach(meal => {
        const mealDate = new Date(meal.id); // Assuming meal.id is a timestamp
        if (mealDate >= startOfWeek) {
            const dayIndex = mealDate.getDay();
            weekData[dayIndex].totalCalories += meal.nutrition.calories;
        }
    });

    return weekData;
};

const getWeeklyWaterData = (waterLog: WaterLogEntry[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyIntake = Array(7).fill(0).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return {
            day: day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
            totalIntake: 0
        };
    });

    waterLog.forEach(entry => {
        const entryDate = new Date(entry.timestamp);
        if (entryDate >= startOfWeek) {
            const dayIndex = entryDate.getDay();
            if (dayIndex >= 0 && dayIndex < 7) {
                weeklyIntake[dayIndex].totalIntake += entry.amount;
            }
        }
    });

    return weeklyIntake;
};

const Header = () => (
    <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <AnalyticsGradientIcon className="w-9 h-9" />
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Monitoramento</h1>
                <p className="text-xs text-gray-400 tracking-wide">Sua nutrição, visualizada com inteligência.</p>
            </div>
        </div>
    </div>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-[#1A1B1E]/60 border border-gray-800/80 rounded-2xl p-4 shadow-2xl shadow-black/50 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const WeeklyCalorieOverview = ({ weeklyData, maxCalories, calorieGoal }: { weeklyData: { day: string, totalCalories: number }[], maxCalories: number, calorieGoal: number }) => (
    <Card className="relative group overflow-hidden">
        <div className="absolute top-4 right-4 w-2 h-full bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
        <h3 className="font-bold text-lg text-gray-200 mb-4">Visão Geral de Calorias da Semana</h3>
        <div className="relative h-40" style={{ paddingTop: '1.5rem' }}>
            {calorieGoal > 0 && (
                <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400/50 z-0"
                    style={{ bottom: `${(calorieGoal / maxCalories) * 100}%` }}
                >
                    <span className="absolute -right-1 -top-2.5 text-xs text-yellow-400/80 font-bold bg-[#1A1B1E] px-1 rounded">{calorieGoal}</span>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-full gap-2 px-1">
                {weeklyData.map((d, i) => {
                    const heightPercentage = Math.min((d.totalCalories / maxCalories) * 100, 100);
                    const isOverGoal = d.totalCalories > calorieGoal;
                    const barColorClass = isOverGoal ? 'from-red-500 to-orange-500' : 'from-blue-600 to-green-500';
                    const shadowColor = isOverGoal ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';

                    return (
                        <div key={i} className="flex-1 h-full flex items-end group/bar">
                            <div className="relative w-full h-full flex items-end">
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none w-max z-10">
                                    <p className="text-center">{Math.round(d.totalCalories)} kcal</p>
                                    {d.totalCalories > 0 && calorieGoal > 0 && (
                                        isOverGoal ? (
                                            <p className="text-red-400 text-center">+{Math.round(d.totalCalories - calorieGoal)}</p>
                                        ) : (
                                            <p className="text-green-400 text-center">-{Math.round(calorieGoal - d.totalCalories)}</p>
                                        )
                                    )}
                                </div>
                                <div
                                    className={`w-full bg-gradient-to-t ${barColorClass} rounded-t-md transition-all duration-500 ease-out origin-bottom hover:opacity-100 opacity-80`}
                                    style={{
                                        height: `${heightPercentage}%`,
                                        animation: `bar-rise 0.8s ${i * 0.05}s ease-out forwards`,
                                        transform: 'scaleY(0)',
                                        filter: `drop-shadow(0 2px 8px ${shadowColor})`
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        <div className="flex justify-around items-end pt-2">
            {weeklyData.map((d) => (
                <span key={d.day} className="flex-1 text-center text-xs font-semibold text-gray-500 capitalize">{d.day}</span>
            ))}
        </div>
        <style>{`
            @keyframes bar-rise {
                to { transform: scaleY(1); }
            }
        `}</style>
    </Card>
);

const MacronutrientRatio = ({ totals, goals }: { totals: { protein: number, carbs: number, fat: number }, goals: DailyGoals }) => {
    const totalMacros = totals.protein + totals.carbs + totals.fat || 1;
    const proteinPercentage = (totals.protein / totalMacros) * 100;
    const carbsPercentage = (totals.carbs / totalMacros) * 100;
    const fatPercentage = (totals.fat / totalMacros) * 100;

    const proteinDiff = goals.protein > 0 ? ((totals.protein - goals.protein) / goals.protein) * 100 : 0;

    return (
        <Card className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2a30" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#F43F5E" strokeWidth="3" strokeDasharray={`${proteinPercentage}, 100`} />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray={`${carbsPercentage}, 100`} strokeDashoffset={`${-proteinPercentage}`} />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#00B4D8" strokeWidth="3" strokeDasharray={`${fatPercentage}, 100`} strokeDashoffset={`${-(proteinPercentage + carbsPercentage)}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold">{Math.round(totals.protein)}g</span>
                    <span className="text-xs text-gray-400">Proteína Hoje</span>
                </div>
            </div>
            <div className="text-center md:text-left">
                <h3 className="font-bold text-lg text-gray-200 mb-2">Proporção de Macronutrientes</h3>
                <p className="text-sm bg-gray-800/50 text-gray-300 p-3 rounded-lg border border-gray-700">
                    Sua proteína está <span className={`font-bold ${proteinDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>{Math.abs(proteinDiff).toFixed(0)}%</span> {proteinDiff >= 0 ? 'acima' : 'abaixo'} da meta diária.
                </p>
            </div>
        </Card>
    )
};

const MealCategory: React.FC<{ title: string, meals: MealPlan['breakfast'] }> = ({ title, meals }) => (
    <div>
        <h4 className="font-semibold text-purple-300">{title}</h4>
        <ul className="list-disc list-inside text-gray-400 pl-2">
            {meals.map(meal => (
                <li key={meal.name}>{meal.name} (~{meal.calories} kcal)</li>
            ))}
        </ul>
    </div>
);

const MealPlanGenerator: React.FC<{ onGenerate: () => void, plan: MealPlan | null, isLoading: boolean, error: string | null }> = ({ onGenerate, plan, isLoading, error }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-gray-200 mb-1">Plano Alimentar Sugerido pela IA</h3>
                <p className="text-xs text-gray-500">Baseado em suas metas diárias.</p>
            </div>
            <ClipboardListIcon className="w-6 h-6 text-purple-400" />
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {plan && (
            <div className="mt-4 space-y-3 text-sm animate-fade-in">
                <MealCategory title="Café da Manhã" meals={plan.breakfast} />
                <MealCategory title="Almoço" meals={plan.lunch} />
                <MealCategory title="Jantar" meals={plan.dinner} />
                <MealCategory title="Lanches" meals={plan.snacks} />
            </div>
        )}

        {!plan && (
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-wait text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {isLoading ? 'Gerando Plano...' : 'Gerar Plano para Hoje'}
            </button>
        )}
    </Card>
);

const AIInsightsPanel: React.FC<{
    goals: DailyGoals;
    todayTotals: { calories: number; protein: number; carbs: number; fat: number; };
    weeklyWaterData: { day: string, totalIntake: number }[];
}> = ({ goals, todayTotals, weeklyWaterData }) => {
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            setError(null);

            if (todayTotals.calories === 0 && todayTotals.protein === 0) {
                setInsights(["Adicione sua primeira refeição de hoje para receber insights personalizados."]);
                setIsLoading(false);
                return;
            }

            const weeklyWaterSummary = weeklyWaterData.map(d => `${d.day}: ${d.totalIntake}ml`).join('; ');

            const prompt = `Aja como um coach de nutrição amigável e motivacional. Com base nas metas diárias de um usuário, no que ele consumiu hoje e no seu histórico de ingestão de água da semana, forneça 2 ou 3 insights ou sugestões curtas e acionáveis.
Seja encorajador e específico. Responda em português.
Formate cada insight em uma nova linha, começando com um emoji relevante. Não use formatação markdown (como ** ou *).

**Instruções de Análise:**
1. Analise o consumo de hoje em relação às metas. Dê parabéns ou sugestões.
2. Analise a consistência da ingestão de água da semana em relação à meta de ${goals.water}ml. Se a ingestão estiver consistentemente baixa (por exemplo, abaixo da meta em 3 ou mais dias), sugira criar um lembrete para beber mais água.
3. Combine os insights mais relevantes em uma resposta coesa.

**Metas Diárias:**
- Calorias: ${goals.calories} kcal
- Proteína: ${goals.protein} g
- Carboidratos: ${goals.carbs} g
- Gorduras: ${goals.fat} g
- Água: ${goals.water} ml

**Consumido Hoje:**
- Calorias: ${Math.round(todayTotals.calories)} kcal
- Proteína: ${Math.round(todayTotals.protein)} g
- Carboidratos: ${Math.round(todayTotals.carbs)} g
- Gorduras: ${Math.round(todayTotals.fat)} g

**Ingestão de Água na Semana:**
${weeklyWaterSummary}
`;

            try {
                const result = await performComplexQuery(prompt);
                setInsights(result.split('\n').filter(line => line.trim() !== ''));
            } catch (err) {
                setError("Não foi possível obter insights da IA no momento. Tente novamente mais tarde.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchInsights, 500); // Small debounce
        return () => clearTimeout(timer);

    }, [goals, todayTotals.calories, todayTotals.protein, todayTotals.carbs, todayTotals.fat, weeklyWaterData]);

    return (
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
                <BrainIcon className="w-6 h-6 text-purple-400" isAnimating={isLoading} />
                <h3 className="font-bold text-gray-200 text-lg">Insights da IA</h3>
            </div>
            {isLoading ? (
                <div className="space-y-3 animate-pulse ml-4">
                    <div className="h-5 bg-gray-700/50 rounded-lg w-11/12"></div>
                    <div className="h-5 bg-gray-700/50 rounded-lg w-10/12"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/40 border border-red-500/50 text-red-300 p-2 rounded-lg ml-4 text-sm">
                    {error}
                </div>
            ) : (
                <div className="space-y-2 text-sm">
                    {insights.map((insight, index) => (
                        <div key={index} className="bg-blue-500/10 border border-blue-500/20 text-blue-200 p-2 rounded-lg ml-4">
                            {insight}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Analytics: React.FC<AnalyticsProps> = ({ meals, goals, waterLog }) => {
    const [mealPlan, setMealPlan] = React.useState<MealPlan | null>(null);
    const [isLoadingPlan, setIsLoadingPlan] = React.useState(false);
    const [errorPlan, setErrorPlan] = React.useState<string | null>(null);

    const weeklyData = getWeekData(meals);
    const weeklyWaterData = getWeeklyWaterData(waterLog);
    const maxCalories = Math.max(...weeklyData.map(d => d.totalCalories), goals.calories, 1);

    const todayTotals = meals.reduce((acc, meal) => {
        const mealDate = new Date(meal.id);
        if (mealDate.toDateString() === new Date().toDateString()) {
            acc.calories += meal.nutrition.calories;
            acc.protein += meal.nutrition.protein;
            acc.carbs += meal.nutrition.carbs;
            acc.fat += meal.nutrition.fat;
        }
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const handleGeneratePlan = async () => {
        setIsLoadingPlan(true);
        setErrorPlan(null);
        try {
            const plan = await generateMealPlan(goals);
            setMealPlan(plan);
        } catch (error) {
            setErrorPlan('Falha ao gerar o plano. Tente novamente.');
            console.error(error);
        } finally {
            setIsLoadingPlan(false);
        }
    };

    return (
        <div className="text-white p-2 space-y-8 animate-fade-in">
            <Header />
            <div className="space-y-6">
                <WeeklyCalorieOverview weeklyData={weeklyData} maxCalories={maxCalories} calorieGoal={goals.calories} />
                <MacronutrientRatio totals={todayTotals} goals={goals} />
                <MealPlanGenerator
                    onGenerate={handleGeneratePlan}
                    plan={mealPlan}
                    isLoading={isLoadingPlan}
                    error={errorPlan}
                />
                <AIInsightsPanel goals={goals} todayTotals={todayTotals} weeklyWaterData={weeklyWaterData} />
            </div>
        </div>
    );
};

export default React.memo(Analytics);