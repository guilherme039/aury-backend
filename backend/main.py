import base64
import openai
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Carrega as variáveis de ambiente
load_dotenv()

# Configure a chave da API
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    # Fallback or error logging
    print("Warning: OPENAI_API_KEY not found in environment variables.")

client = openai.OpenAI(
    api_key=api_key,
    base_url="https://api.piapi.ai/v1" 
)

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev, or specific ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Lê a imagem e converte para base64
        image_bytes = await file.read()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')

        # Envia para a API da IA
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "system",
                    "content": """Você é um nutricionista e analista de imagem culinária experiente. Sua tarefa é analisar a foto do prato de comida, identificar os alimentos, estimar as quantidades e calcular o valor nutricional total.

Retorne o resultado ESTRITAMENTE no seguinte formato JSON (sem markdown, apenas o JSON):
{
  "total_calories": "Número total de kcal estimado (apenas números)",
  "total_carbs": "Número total de gramas de carboidratos estimado (apenas números)",
  "total_fats": "Número total de gramas de gorduras estimado (apenas números)",
  "total_protein": "Número total de gramas de proteínas estimado (apenas números)",
  "detailed_analysis": [
    {
      "food": "Nome do Alimento 1", 
      "estimated_weight_g": "Peso em g (apenas números)", 
      "calories": "kcal (apenas números)",
      "protein": "g (apenas números)",
      "carbs": "g (apenas números)",
      "fat": "g (apenas números)"
    },
    {
      "food": "Nome do Alimento 2", 
      "estimated_weight_g": "Peso em g (apenas números)", 
      "calories": "kcal (apenas números)",
      "protein": "g (apenas números)",
      "carbs": "g (apenas números)",
      "fat": "g (apenas números)"
    }
  ]
}"""
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analise esta imagem, identifique os alimentos e estime as calorias e macronutrientes."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,
            temperature=0.1
        )

        # Extrai o resultado
        content = response.choices[0].message.content
        
        # Limpar markdown se houver
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        
        import json
        try:
            result_json = json.loads(content)
            return result_json
        except json.JSONDecodeError:
            print(f"Erro ao decodificar JSON: {content}")
            # Tentar recuperar ou retornar erro formatado
            return {"error": "Falha ao processar resposta da IA", "raw_content": content}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint de teste (sanity check)
@app.get("/")
def read_root():
    return {"status": "online", "message": "Backend Python rodando!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
