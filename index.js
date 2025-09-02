const {createServer}=require('node:http');
const path=require('path');
const fs=require('fs');
const url = require('url');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://codetestst:<pwd>@cluster-st-codetest.u9esacd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-ST-CodeTest";

require('dotenv').config();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const hostname='127.0.0.1';
const port=3600;
const server=createServer((req,res)=>{
    //console.log(process.env.MSG);
    const req_url=req.url;
    const requested_file_path=path.join(__dirname,req_url);
    const file_ext=path.extname(requested_file_path);
    //console.log(`Req File Path: ${requested_file_path}`);
    //console.log(`File Extension: ${file_ext}`);
    // /console.log(`req url: ${req.url}`);
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    
    console.log('Parsed URL');
    console.log(parsedUrl);

    
    const content_types={
        '.html':'text/html',
        '.css':'text/css',
        '.js':'application/js',
        '.jpg':'image/jpg',
        '.gif':'image/gif',
        '.png':'image/png',
        '.webp':'image/webp',
        '.svg': 'image/svg'
    };
    const content_type=content_types[file_ext]; // bracket notation
    const html_pages={
        '/':'/views/index.html',
        '/about':'/views/about.html',
        '/blog':'/views/blog.html',
        '/contact':'/views/contact.html',
        '/projects':'/views/projects.html',
        '/project-details':'/views/project-details.html',
        '/blog-details':'/views/blog-details.html',
       };

    const html_page=html_pages[parsedUrl.pathname];
    console.log(`Html Page ${html_page}`);

    if(html_page)
    {
            

            const home_page=path.join(__dirname,`${html_page}`);
            fs.readFile(home_page,(err,data)=>{
            if(err)
            {
                res.setHeader('Content-Type',`${content_type}`);
                res.statusCode=404;
                res.end('<h1>404 Page Not Found</h1>');
            }
            else
            {
               
                
                if(Object.keys(queryParams).length!=0)
                {
                console.log("query params:");
                console.log(`Welcome :${queryParams.name}`);
                }
                data=data.toString(); // local scope and global

                const common_header_page=path.join(__dirname,'/views/common_head.html');
                //common head read start  
                fs.readFile(common_header_page,(cerr,common_header)=>{
                    if(cerr)
                    {
                        res.setHeader('Content-Type',`text/html`);
                        res.statusCode=404;
                        res.end('<h1>404 common head Not Found</h1>');       
                    }
                    else
                    {
                        
                        
                        data=data.replace('[common-head]',common_header.toString());
                        const common_menu_page=path.join(__dirname,'/views/common-menu.html');
                        //common menu read start  
                        fs.readFile(common_menu_page,(cmerr,common_menu)=>{
                            if(cmerr)
                            {
                                res.setHeader('Content-Type',`text/html`);
                                res.statusCode=404;
                                res.end('<h1>404 common menu Not Found</h1>');       
                            }
                            else
                            {
                                
                                
                                data=data.replace('[common-menu]',common_menu.toString());
                                const common_footer_page=path.join(__dirname,'/views/common_footer.html');     
                                //common footer read start  
                                fs.readFile(common_footer_page,(cferr,common_footer)=>{
                                    if(cferr)
                                    {
                                        res.setHeader('Content-Type',`text/html`);
                                        res.statusCode=404;
                                        res.end('<h1>404 common footer Not Found</h1>');       
                                    }
                                    else
                                    {
                                        
                                        
                                        data=data.replace('[common-footer]',common_footer.toString());
                                        //console.log(data);  // ok
                                        res.setHeader('Content-Type',`${content_type}`);
                                        res.statusCode=200;
                                    
                                        res.end(data);
                                    }
                                });
                            }
                        });
                            
                    }
                });
            }
        });
    } 
    else if (parsedUrl.pathname === '/submit-contact' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => 
            {
                body += chunk.toString()
            });

            req.on('end', () => {
            const data = querystring.parse(body);

            console.log("Received AJAX contact form data:");
            console.log(data);
            // Connect the client to the server	(optional starting in v4.7)
            client.connect();
            // Send a ping to confirm a successful connection
            client.db("portfolioDB").command({ ping: 1 });

            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const myDB = client.db("portfolioDB");
            const myColl = myDB.collection("contactUsData");
            const result = myColl.insertOne(data);
            console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
            );
            /*
                            {
                name: 'Rai',
                email: 'rai.verma@gmail.com',
                phone: '9813222299',
                subject: 'Hello',
                message: 'Hello Rai'
                }
            */
             // Create a transporter object using Gmail's SMTP server
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Specify the email service as 'gmail'
                auth: {
                user: 'codetest.st@gmail.com', // Your Gmail address
                pass: '...' // Your generated App Password
                }
            });
             // Define the email options
            const mailOptions = {
                from: 'codetest.st@gmail.com', // Sender address (your Gmail address)
                to: `${data.email}`, // Recipient's email address
                subject: 'Thank to Reaching us!', // Subject line
                text: 'Our Executive contact you soon.', // Plain text body
                html: '<p>This is a test email sent from Node.js using <b>Nodemailer</b> and Gmail App Password.</p>' // HTML body (optional)
            };
            // Send the email
            transporter.sendMail(mailOptions)
            .then((info) => {
            console.log('Email sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            })
            .catch((error) => {
            console.error('Error sending email:', error.message);
            });
           //Send a plain text response (AJAX expects this)
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("Thanks! Your message has been sent.");
        });
    }

    else if(req_url.includes('assets/css'))
    {
            var page=fs.readFile(requested_file_path,(err,data)=>{
            if(err)
            {
                res.setHeader('Content-Type',`text/html`);
                res.statusCode=404;
                res.end('<h1>css not load</h1>');
            }
            else
            {
                res.setHeader('Content-Type',`${content_type}`);
                res.statusCode=200;
                res.end(data);
            }
        });
   }
   else if(req_url.includes('assets/js'))
   {
        var page=fs.readFile(requested_file_path,(err,data)=>{
            if(err)
            {
                res.setHeader('Content-Type',`text/html`);
                res.statusCode=404;
                res.end('<h1>js Not Found</h1>');
            }
            else
            {
                res.setHeader('Content-Type',`${content_type}`);
                res.statusCode=200;
               
                res.end(data);
            }
        });
   }
   else if(req_url.includes('assets/images'))
   {
        var page=fs.readFile(requested_file_path,(err,data)=>{
            if(err)
            {
                res.setHeader('Content-Type',`text/html`);
                res.statusCode=404;
                res.end('<h1>Image Not Found</h1>');
            }
            else
            {
                res.setHeader('Content-Type',`${content_type}`);
                res.statusCode=200;
                res.end(data);
            }
        });
   }
});
 server.listen(port,hostname,()=>{
    console.log(`Server Started at http://${hostname}:${port}`);        
});