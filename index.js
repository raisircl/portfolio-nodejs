const {createServer}=require('node:http');
const path=require('path');
const fs=require('fs');
const hostname='127.0.0.1';
const port=3600;
const server=createServer((req,res)=>{
    const req_url=req.url;
    const requested_file_path=path.join(__dirname,req_url);
    const file_ext=path.extname(requested_file_path);
    //console.log(`Req File Path: ${requested_file_path}`);
    //console.log(`File Extension: ${file_ext}`);
    // /console.log(`req url: ${req.url}`);
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
    const html_page=html_pages[req_url];

    //console.log(`Html Page ${html_page}`);

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
                         
                    }
                });
               // head read end
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
                         
                    }
                });
               // head read end
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