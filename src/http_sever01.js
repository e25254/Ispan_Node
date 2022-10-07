const http = require('http')

const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-type':'text/plain'
    })
    res.end(`<h2>${req.url}</h2>`)
})

server.listen(3002)