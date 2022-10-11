require("dotenv").config()

const express = require("express")

const app = express()

app.set("view engine", "ejs")

// routes 路由器
app.get("/a", (req, res) => {
    // res.send(`<h2>你好</h2>`)
    res.render("main", { name: "Jie" })
})

app.get("/sales-json", (req, res) => {
    const sales = require(__dirname + '/data/sales.json')
    console.log(sales);
    res.render(`sales-json`,{sales})
})

app.get('/json-test', (req, res) => {
        // res.send({ name: '小新1', age: 30 });
        res.json({ name: '小新2', age: 30 });
    });

app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))

app.use((req, res) => {
    // res.type("text/plain")
    res.status(404).render("404")
})

// node_modules/bootstrap/dist/css/bootstrap.css

const port = process.env.SERVER_PORT || 3002
app.listen(port, () => {
    console.log(`server started,port:${port} `)
})
