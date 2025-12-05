
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/v1/chat/completions";

const systemPrompt = "Você é um nutricionista. Retorne JSON.";
const userPrompt = "Analise esta imagem.";

// Valid JPEG Base64 (Red Dot)
const base64Image = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAAFgAAQAAAAAAAAAAAAAAAAAAAAEQAQAAAAAAAAAAAAAAAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAA=";

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

        console.log("Iniciando teste com JPEG válido...");

        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                console.log("Body:", body.substring(0, 300));
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(e);
            resolve();
        });

        req.write(data);
        req.end();
    });
};

testFullFlow();
