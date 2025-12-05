import { Meal, WaterLogEntry } from '../types';

interface StoredMeal extends Meal {
    timestamp: number;
}

interface StoredWaterEntry extends WaterLogEntry {
    // timestamp já existe em WaterLogEntry
}

const STORAGE_KEYS = {
    MEALS: 'meals',
    WATER_LOG: 'waterLog',
    DAILY_GOALS: 'dailyGoals',
    USER_SESSION: 'userSession',
    ONBOARDING_COMPLETE: 'onboardingComplete',
} as const;

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

/**
 * Serviço centralizado para gerenciar armazenamento local
 */
class StorageService {
    /**
     * Limpa dados expirados (mais de 24 horas)
     * Deve ser chamado na inicialização do app
     */
    cleanExpiredData(): void {
        console.log('Limpando dados expirados...');
        const now = Date.now();

        // Limpar refeições antigas
        try {
            const meals = this.getMeals();
            const validMeals = meals.filter(meal => {
                const age = now - meal.timestamp;
                return age < EXPIRATION_TIME;
            });

            if (validMeals.length !== meals.length) {
                console.log(`Removidas ${meals.length - validMeals.length} refeições expiradas`);
                this.saveMeals(validMeals);
            }
        } catch (error) {
            console.error('Erro ao limpar refeições:', error);
        }

        // Limpar registros de água antigos
        try {
            const waterLog = this.getWaterLog();
            const validWater = waterLog.filter(entry => {
                const age = now - entry.timestamp;
                return age < EXPIRATION_TIME;
            });

            if (validWater.length !== waterLog.length) {
                console.log(`Removidos ${waterLog.length - validWater.length} registros de água expirados`);
                this.saveWaterLog(validWater);
            }
        } catch (error) {
            console.error('Erro ao limpar água:', error);
        }
    }

    /**
     * Salva uma refeição com timestamp
     */
    addMeal(meal: Omit<Meal, 'timestamp'>): Meal {
        const storedMeal: StoredMeal = {
            ...meal,
            timestamp: Date.now(),
        };

        const meals = this.getMeals();
        meals.unshift(storedMeal); // Adiciona no início
        this.saveMeals(meals);

        return storedMeal;
    }

    /**
     * Obtém todas as refeições válidas (não expiradas)
     */
    getMeals(): StoredMeal[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.MEALS);
            if (!data) return [];

            const meals: StoredMeal[] = JSON.parse(data);
            const now = Date.now();

            // Retorna apenas refeições válidas
            return meals.filter(meal => {
                const age = now - meal.timestamp;
                return age < EXPIRATION_TIME;
            });
        } catch (error) {
            console.error('Erro ao ler refeições:', error);
            return [];
        }
    }

    /**
     * Salva refeições
     */
    private saveMeals(meals: StoredMeal[]): void {
        try {
            localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
        } catch (error) {
            console.error('Erro ao salvar refeições:', error);
        }
    }

    /**
     * Remove uma refeição por ID
     */
    deleteMeal(mealId: number): void {
        const meals = this.getMeals();
        const filtered = meals.filter(meal => meal.id !== mealId);
        this.saveMeals(filtered);
    }

    /**
     * Adiciona registro de água
     */
    addWaterEntry(amount: number): WaterLogEntry {
        const entry: WaterLogEntry = {
            amount,
            timestamp: Date.now(),
        };

        const waterLog = this.getWaterLog();
        waterLog.push(entry);
        this.saveWaterLog(waterLog);

        return entry;
    }

    /**
     * Obtém registros de água válidos
     */
    getWaterLog(): WaterLogEntry[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.WATER_LOG);
            if (!data) return [];

            const waterLog: WaterLogEntry[] = JSON.parse(data);
            const now = Date.now();

            return waterLog.filter(entry => {
                const age = now - entry.timestamp;
                return age < EXPIRATION_TIME;
            });
        } catch (error) {
            console.error('Erro ao ler água:', error);
            return [];
        }
    }

    /**
     * Salva registros de água
     */
    private saveWaterLog(waterLog: WaterLogEntry[]): void {
        try {
            localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(waterLog));
        } catch (error) {
            console.error('Erro ao salvar água:', error);
        }
    }

    /**
     * Limpa todos os dados
     */
    clearAll(): void {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    /**
     * Obtém estatísticas de armazenamento
     */
    getStats(): { meals: number; waterEntries: number; oldestMeal: number | null } {
        const meals = this.getMeals();
        const waterLog = this.getWaterLog();

        const oldestMeal = meals.length > 0
            ? Math.min(...meals.map(m => m.timestamp))
            : null;

        return {
            meals: meals.length,
            waterEntries: waterLog.length,
            oldestMeal,
        };
    }
}

// Exporta instância singleton
export const storageService = new StorageService();
