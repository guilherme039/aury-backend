

// Serviço de análise de imagem usando backend Python local
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionInfo, DailyGoals, MealPlan, ScanResult } from '../types';

// Backend local Python
const LOCAL_BACKEND_URL = 'http://localhost:8000';

/**
 * Converte base64 para Blob para envio via FormData
 */
function base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}

/**
 * Analisa imagem de comida usando o backend Python local
 */
export const analyzeFoodImage = async (base64Image: string): Promise<ScanResult> => {
  console.log("Iniciando análise com backend local...");

  try {
    // Converter base64 para Blob
    const imageBlob = base64ToBlob(base64Image);

    // Criar FormData para envio
    const formData = new FormData();
    formData.append('file', imageBlob, 'food.jpg');

    // Timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Fazer requisição para o backend local
    // MUDANÇA AQUI: Adicionando a barra final
    const response = await fetch(`${LOCAL_BACKEND_URL}/analyze-image/`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`Erro no servidor local (Status ${response.status})`);
    }

    const rawResult = await response.json();
    console.log("Análise bruta recebida:", rawResult);

    // Helper para limpar e converter números
    const parseNumber = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const cleaned = value.replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    // Mapear resposta do backend para ScanResult
    const detectedFoods = (rawResult.detailed_analysis || []).map((item: any) => ({
      foodName: item.food,
      weightGrams: parseNumber(item.estimated_weight_g),
      calories: parseNumber(item.calories),
      protein: parseNumber(item.protein),
      carbs: parseNumber(item.carbs),
      fat: parseNumber(item.fat),
      confidenceScore: 0.95, // Valor padrão
      adjustmentSuggestion: `Porção estimada: ${item.estimated_weight_g}g`
    }));

    const result: ScanResult = {
      mealName: detectedFoods.map((f: any) => f.foodName).join(" + "),
      totalNutrition: {
        calories: parseNumber(rawResult.total_calories),
        protein: parseNumber(rawResult.total_protein),
        carbs: parseNumber(rawResult.total_carbs),
        fat: parseNumber(rawResult.total_fats)
      },
      detectedFoods: detectedFoods
    };

    return result;

  } catch (error: any) {
    console.error("Erro ao analisar imagem:", error);

    // Mensagens de erro específicas
    if (error.name === 'AbortError') {
      throw new Error("A análise demorou muito tempo. Verifique se o servidor Python está rodando.");
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error("Não foi possível conectar ao servidor local. Certifique-se de que o backend Python está rodando em http://localhost:8000");
    }

    if (error.message.includes('servidor local')) {
      throw error;
    }

    throw new Error("Erro ao processar a imagem. Tente novamente.");
  }
};

// Funções de geração de plano alimentar e consultas complexas (Stubs para compatibilidade)
export const generateMealPlan = async (goals: DailyGoals): Promise<MealPlan> => {
  console.log("Gerando plano alimentar (Stub)...");
  // Mock response
  return {
    breakfast: [{ name: "Aveia com Frutas", calories: 300, protein: 10, carbs: 50, fat: 5 }],
    lunch: [{ name: "Frango Grelhado com Salada", calories: 500, protein: 40, carbs: 10, fat: 20 }],
    dinner: [{ name: "Peixe Assado com Legumes", calories: 400, protein: 35, carbs: 5, fat: 15 }],
    snacks: [{ name: "Iogurte Natural", calories: 150, protein: 10, carbs: 10, fat: 5 }]
  };
};

export const performComplexQuery = async (prompt: string): Promise<string> => {
  console.log("Executando consulta complexa (Stub):", prompt);
  return "Insight da IA: Mantenha-se hidratado e focado nas proteínas! (Funcionalidade em migração para Python)";
};