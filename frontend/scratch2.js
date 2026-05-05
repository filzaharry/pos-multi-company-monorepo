const http = require('http');

const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/login/otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Login response:", data);
        const parsed = JSON.parse(data);
        // We actually need the verify OTP call... wait!
        // But let's just see what it returns.
    });
});

req.write(JSON.stringify({
    email: 'harryfilza@gmail.com',
    password: 'filza123'
}));
req.end();
