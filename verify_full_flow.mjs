
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/v1/chat/completions";

// O mesmo prompt usado no geminiService.ts
const systemPrompt = `Você é um nutricionista especialista em visão computacional. Analise a imagem fornecida com extrema precisão.
            
TAREFA:
1. Identifique TODOS os alimentos presentes na imagem.
2. Para cada alimento, estime o peso em gramas com base no tamanho da porção visualizada.
3. Calcule as calorias, proteínas, carboidratos e gorduras para cada item.
4. Forneça uma bounding box [x1, y1, x2, y2] normalizada (0-1) para cada item.
5. Dê um nome descritivo em português para cada item (ex: "Arroz Branco", "Filé de Frango Grelhado").
6. Forneça uma sugestão de ajuste nutricional curta e útil.

IMPORTANTE:
- Seja realista nas estimativas de peso.
- Se houver múltiplos itens, liste todos separadamente.
- O campo 'mealName' deve ser um resumo do prato (ex: "Prato Feito com Frango e Salada").
- Retorne APENAS o JSON válido seguindo o schema fornecido.`;

const userPrompt = "Analise esta imagem de comida detalhadamente. Identifique TODOS os itens visíveis, suas quantidades aproximadas, peso em gramas e informações nutricionais. Para cada item, forneça uma bounding box precisa. Retorne APENAS o JSON conforme o esquema solicitado, sem markdown.";

// Imagem de teste (um pixel branco em base64 apenas para validar o fluxo, a IA vai reclamar da imagem mas deve retornar erro ou tentar alucinar, o importante é a conexão)
// Na prática, para testar "real", precisariamos de uma imagem real. Vou usar uma string curta valida.
const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const payload = {
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
        }
    ]
};

const testFullFlow = () => {
    return new Promise((resolve) => {
        const data = JSON.stringify(payload);
        const url = new URL(endpoint);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': data.length
            }
        };

        console.log("Iniciando simulação completa de análise...");
        const startTime = Date.now();

        const req = https.request(options, (res) => {
            console.log(`Status da API: ${res.statusCode}`);
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                const endTime = Date.now();
                console.log(`Tempo de resposta: ${(endTime - startTime) / 1000}s`);

                try {
                    const json = JSON.parse(body);
                    if (json.error) {
                        console.error("ERRO DA API:", json.error);
                    } else {
                        const content = json.choices[0].message.content;
                        console.log("\n--- Resposta da IA (Conteúdo) ---");
                        console.log(content.substring(0, 500) + "..."); // Mostrar início

                        // Validar JSON interno
                        try {
                            const parsedContent = JSON.parse(content);
                            console.log("\n--- Validação Estrutural ---");
                            console.log("mealName:", parsedContent.mealName ? "OK" : "FALTANDO");
                            console.log("totalNutrition:", parsedContent.totalNutrition ? "OK" : "FALTANDO");
                            console.log("detectedFoods:", Array.isArray(parsedContent.detectedFoods) ? `OK (${parsedContent.detectedFoods.length} itens)` : "FALTANDO/INVÁLIDO");
                        } catch (e) {
                            console.error("Erro ao fazer parse do conteúdo JSON da IA:", e.message);
                        }
                    }
                } catch (e) {
                    console.error("Erro ao ler resposta bruta:", e.message);
                    console.log("Corpo bruto:", body);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error("Erro de conexão:", e.message);
            resolve();
        });

        req.write(data);
        req.end();
    });
};

testFullFlow();
