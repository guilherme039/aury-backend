
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoints = [
    "https://api.piapi.ai/v1/chat/completions",
    "https://api.piapi.ai/api/v1/chat/completions", // Original
    "https://api.piapi.ai/api/chat/completions",
    "https://api.piapi.ai/chat/completions"
];

const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hi" }]
});

const testEndpoint = (endpoint) => {
    return new Promise((resolve) => {
        const url = new URL(endpoint);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-API-Key': apiKey,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            console.log(`[${res.statusCode}] ${endpoint}`);
            if (res.statusCode === 200) {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => console.log('SUCCESS BODY:', body.substring(0, 100)));
            }
            resolve();
        });

        req.on('error', (e) => {
            console.log(`[ERROR] ${endpoint}: ${e.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
};

const runTests = async () => {
    for (const ep of endpoints) {
        await testEndpoint(ep);
    }
};

runTests();
