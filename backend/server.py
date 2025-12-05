from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import random

app = FastAPI(title="Aury Food Analysis API")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3004", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dados mock para simulação de análise
MOCK_FOODS = [
    {"nome": "Arroz Branco", "calorias": 130, "proteina": 2.7, "carboidratos": 28, "gordura": 0.3, "peso": 100},
    {"nome": "Feijão Preto", "calorias": 77, "proteina": 4.5, "carboidratos": 14, "gordura": 0.5, "peso": 80},
    {"nome": "Frango Grelhado", "calorias": 165, "proteina": 31, "carboidratos": 0, "gordura": 3.6, "peso": 100},
    {"nome": "Salada Verde", "calorias": 15, "proteina": 1.2, "carboidratos": 3, "gordura": 0.2, "peso": 50},
    {"nome": "Batata Frita", "calorias": 312, "proteina": 3.4, "carboidratos": 41, "gordura": 15, "peso": 100},
    {"nome": "Sushi (Niguiri)", "calorias": 60, "proteina": 3, "carboidratos": 8, "gordura": 1, "peso": 30},
    {"nome": "Temaki", "calorias": 200, "proteina": 8, "carboidratos": 25, "gordura": 7, "peso": 120},
    {"nome": "Camarão", "calorias": 99, "proteina": 24, "carboidratos": 0.2, "gordura": 0.3, "peso": 100},
    {"nome": "Bife", "calorias": 250, "proteina": 26, "carboidratos": 0, "gordura": 17, "peso": 100},
    {"nome": "Macarrão", "calorias": 158, "proteina": 5.8, "carboidratos": 31, "gordura": 0.9, "peso": 100},
]

def generate_bounding_box():
    """Gera uma bounding box aleatória normalizada"""
    x1 = random.uniform(0.1, 0.5)
    y1 = random.uniform(0.1, 0.5)
    width = random.uniform(0.2, 0.4)
    height = random.uniform(0.2, 0.4)
    
    return {
        "x1": round(x1, 3),
        "y1": round(y1, 3),
        "x2": round(min(x1 + width, 0.95), 3),
        "y2": round(min(y1 + height, 0.95), 3)
    }

@app.get("/")
async def root():
    return {"status": "online", "message": "Aury Food Analysis API"}

@app.post("/analisar-imagem/")
async def analisar_imagem(file: UploadFile = File(...)):
    """
    Endpoint para análise de imagem de comida.
    Por enquanto retorna dados mock simulados.
    """
    
    # Validar tipo de arquivo
    if not file.content_type.startswith("image/"):
        return {"error": "Arquivo deve ser uma imagem"}
    
    # Simular análise: selecionar 2-4 alimentos aleatórios
    num_foods = random.randint(2, 4)
    selected_foods = random.sample(MOCK_FOODS, num_foods)
    
    # Construir resposta no formato esperado pelo frontend
    detected_foods = []
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    
    for food in selected_foods:
        detected_food = {
            "foodName": food["nome"],
            "boundingBox": generate_bounding_box(),
            "weightGrams": food["peso"],
            "calories": food["calorias"],
            "protein": food["proteina"],
            "carbs": food["carboidratos"],
            "fat": food["gordura"],
            "confidenceScore": round(random.uniform(0.85, 0.98), 2),
            "adjustmentSuggestion": f"Porção adequada de {food['nome'].lower()}. Continue assim!"
        }
        detected_foods.append(detected_food)
        
        total_calories += food["calorias"]
        total_protein += food["proteina"]
        total_carbs += food["carboidratos"]
        total_fat += food["gordura"]
    
    # Nome da refeição baseado nos alimentos
    food_names = [f["nome"] for f in selected_foods]
    meal_name = " com ".join(food_names[:2])
    if len(food_names) > 2:
        meal_name += " e mais"
    
    response = {
        "mealName": meal_name,
        "totalNutrition": {
            "calories": round(total_calories, 1),
            "protein": round(total_protein, 1),
            "carbs": round(total_carbs, 1),
            "fat": round(total_fat, 1)
        },
        "detectedFoods": detected_foods
    }
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
