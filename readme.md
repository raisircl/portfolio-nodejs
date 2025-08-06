1. .env File for Secure Email Credentials
2. npm install dotenv
3.  EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-password
4. Use: 
    require('dotenv').config(); // Add this at the top
    const auth=auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    
5. step-by-step usage of querystring module in Node.js (CommonJS style).
    The querystring module helps you parse and stringify URL query strings, like:
    ?name=RAI&email=rai@example.com
    Usage Steps:
        const url = require('url');
        const querystring = require('querystring');
        
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        
        const name = queryParams.name || 'Guest';
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Hello, ${name}!`);