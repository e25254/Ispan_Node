require('dotenv').config();

const express = require('express')

const app = express()

app.use(express.static(__dirname+'/public'));

// routes 路由器
app.get('/', (req, res) => {
    res.send(`<h2>你好</h2>`)
})

app.get('/abc', (req, res) => {
    res.send(`<h2>abc</h2>`)
})

app.use((req, res) => {
    res.type('text/plain');
    res.status(404).send('找不到你要的頁面')
})


const port = process.env.SERVER_PORT || 3002
app.listen(port,()=>{
    console.log(`server started,port:${port} `);
})