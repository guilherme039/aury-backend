
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/v1/chat/completions";

const testModel = (model) => {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            model: model,
            messages: [{ role: "user", content: "Hi" }]
        });

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

        console.log(`Testing model: ${model}`);

        const req = https.request(options, (res) => {
            console.log(`[${res.statusCode}] for ${model}`);
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                console.log('Body:', body);
            });
            resolve();
        });

        req.on('error', (e) => {
            console.log(`[ERROR] ${e.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
};

const runTests = async () => {
    await testModel('gpt-3.5-turbo');
    await testModel('gpt-4-vision-preview');
    await testModel('gpt-4o');
};

runTests();
