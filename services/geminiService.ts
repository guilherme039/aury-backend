
// Serviço de análise de imagem usando backend remoto
import { ScanResult, DailyGoals, MealPlan } from '../types';
import { BACKEND_URL } from '../backendConfig';

/**
 * Analisa imagem de comida usando o backend remoto
 */
export const analyzeFoodImage = async (base64Image: string): Promise<ScanResult> => {
  console.log("Iniciando análise com backend remoto...");

  try {
    // Converter base64 para Blob
    const byteString = atob(base64Image);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file); // key changed to 'image' as requested

    // Fazer requisição para o backend remoto
    // URL hardcoded conforme solicitado pelo usuário para garantir consistência
    const response = await fetch("https://aury-backend.onrender.com/analisar-imagem", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`Erro no servidor (Status ${response.status})`);
    }

    const data = await response.json();
    console.log("Resposta bruta:", data);

    // O backend atual retorna o resultado diretamente ou dentro de uma chave?
    // Baseado no request anterior, vamos assumir que data já é o resultado ou tem structure similar
    // Vamos garantir que retornamos o formato ScanResult esperado pelo frontend

    return data as ScanResult;

  } catch (error: any) {
    console.error("Erro ao analisar imagem:", error);
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