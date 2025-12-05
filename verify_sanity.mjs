
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/v1/chat/completions";

const payload = {
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
        { role: "system", content: "You are a helper. Return JSON." },
        { role: "user", content: "Say hello in JSON." }
    ]
};

const testSanity = () => {
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

        console.log("Teste de Sanidade (GPT-4o + JSON Mode)...");

        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                console.log("Body:", body);
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

testSanity();
