
const https = require('https');

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/api/v1/chat/completions";

const data = JSON.stringify({
    model: "gpt-3.5-turbo", // Testando com um modelo simples primeiro
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" }
    ]
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey // Tentando ambos os headers comuns
    }
};

console.log(`Testing endpoint: ${endpoint}`);

const req = https.request(endpoint, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Response Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
