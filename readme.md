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
    
    Read data on submit:
    What is 'data' in req.on('data', ...)?
    In Node.js, when a client (like a browser) sends an HTTP request with a body (usually for POST, PUT, etc.), the body doesn't arrive all at once — it comes in chunks (like small packets).

    Node gives you a way to listen for these incoming chunks using:
    req.on('data', (chunk) => {
    // do something with chunk
    });


'data' is the name of the event

You're telling Node:
“Whenever a new chunk of data comes in from the client, please call this function.”
let body = '';

req.on('data', chunk => {
  body += chunk.toString();  // `chunk` is a Buffer (binary data)
});

req.on('end', () => {
  console.log('Full body:', body);  // Now the full form or post data is available
});

| Concept            | Meaning                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `'data'` event     | Built-in Node.js event triggered for each chunk of body data received |
| `chunk`            | A piece of the request body (a `Buffer`)                              |
| `chunk.toString()` | Converts the binary chunk to human-readable string                    |
| `body += ...`      | Accumulates the entire message in one variable                        |
