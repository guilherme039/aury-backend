
import https from 'https';

const apiKey = "49518d27e98154c282dd0473c565f1691b0978b89d0a059ea321b984524365e1";
const endpoint = "https://api.piapi.ai/v1/chat/completions";

const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hi" }]
});

const testHeader = (headerName, headerValue) => {
    return new Promise((resolve) => {
        const url = new URL(endpoint);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [headerName]: headerValue,
                'Content-Length': data.length
            }
        };

        console.log(`Testing header: ${headerName}`);

        const req = https.request(options, (res) => {
            console.log(`[${res.statusCode}] with ${headerName}`);
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode !== 200) console.log('Error Body:', body.substring(0, 200));
                else console.log('Success!');
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
    await testHeader('Authorization', `Bearer ${apiKey}`);
    await testHeader('X-API-Key', apiKey);
};

runTests();
