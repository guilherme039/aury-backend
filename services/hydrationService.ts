const WEIGHT_KEY = 'userWeightKg';
const GOAL_KEY = 'dailyWaterGoalMl';
const HISTORY_KEY = 'waterHistory';

// 1. Lógica de Cálculo da Meta (35ml/kg)
export const calculateGoal = (weightKg: number): number => {
    if (weightKg <= 0 || isNaN(weightKg)) {
        return 0;
    }
    // Fórmula: 35 ml por kg de peso corporal
    return Math.round(weightKg * 35);
};

// 2. Persistência do Peso
export const saveWeight = (weightKg: number): void => {
    localStorage.setItem(WEIGHT_KEY, weightKg.toString());
};

export const getWeight = (): number => {
    const weight = localStorage.getItem(WEIGHT_KEY);
    // Retorna 75kg como padrão se não houver peso salvo (baseado na sua imagem)
    return weight ? parseFloat(weight) : 75;
};

// 3. Persistência da Meta
export const saveGoal = (goalMl: number): void => {
    localStorage.setItem(GOAL_KEY, goalMl.toString());
};

export const getGoal = (): number => {
    const savedGoal = localStorage.getItem(GOAL_KEY);
    // Se não houver meta salva, calcula uma meta inicial baseada no peso padrão
    if (savedGoal) {
        return parseInt(savedGoal, 10);
    }
    return calculateGoal(getWeight());
};

interface WaterIntake {
    timestamp: number;
    amount: number;
}

// 4. Persistência do Histórico de Consumo (Diário de Hoje)
// O histórico é salvo como um array de objetos { timestamp: number, amount: number }
export const getTodayHistory = (): WaterIntake[] => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');

    // Retorna o histórico de hoje. Se não existir, retorna um array vazio.
    return history[today] || [];
};

export const addWaterIntake = (amountMl: number): void => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');

    // Adiciona o novo registro ao histórico de hoje
    const newIntake: WaterIntake = {
        timestamp: Date.now(),
        amount: amountMl
    };

    history[today] = [...(history[today] || []), newIntake];

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

// 5. Cálculo do Total Consumido Hoje
export const getTodayTotal = (): number => {
    const history = getTodayHistory();
    return history.reduce((total, intake) => total + intake.amount, 0);
};

// 6. Função para "Zerar" o consumo de hoje
export const clearTodayHistory = (): void => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');

    // Remove o registro de hoje
    delete history[today];

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
