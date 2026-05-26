const http = require('http');

const data = JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    password: "123456"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let response = '';
    res.on('data', (chunk) => { response += chunk; });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', response);
    });
});

req.on('error', (e) => { console.error('Error:', e.message); });
req.write(data);
req.end();
