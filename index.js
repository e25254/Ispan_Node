require("dotenv").config()

const express = require("express")
// const multer = require("multer")
// const upload = multer({ dest: "tmp_uploads/" })
const upload = require(__dirname + "/modules/upload-img")
const fs = require("fs").promises

const app = express()

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// routes 路由器
app.get("/", (req, res) => {
	// res.send(`<h2>你好</h2>`)
	res.render("main", { name: "Jie" })
})

app.get("/sales-json", (req, res) => {
	const sales = require(__dirname + "/data/sales.json")
	console.log(sales)
	res.render(`sales-json`, { sales })
})

app.get("/json-test", (req, res) => {
	// res.send({ name: '小新1', age: 30 });
	res.json({ name: "小新2", age: 30 })
})

app.get("/try-qs", (req, res) => {
	res.json(req.query)
})

app.post("/try-post", (req, res) => {
	res.json(req.body)
})

app.get("/try-post-form", (req, res) => {
	res.render("try-post-form")
})

app.post("/try-post-form", (req, res) => {
	res.render("try-post-form", req.body)
})

app.post("/try-upload", upload.single("avatar"), async (req, res) => {
	res.json(req.file)
	// if (req.file && req.file.originalname) {
	// 	await fs.rename(req.file.path, `public/img/${req.file.originalname}`)
	// 	res.json(req.file)
	// } else {
	// 	res.json({ msg: "沒有上傳檔案" })
	// }
})

app.post("/try-upload2", upload.array("photos"), async (req, res) => {
	res.json(req.files)
})

app.get("/my-params1/:action?/:id?", async (req, res) => {
	res.json(req.params)
})

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
	let u = req.url.slice(3)
	u = u.split("?")[0] // 去掉 query string
	u = u.split("-").join("")
	res.json({ mobile: u })
})

app.use("/admin2", require(__dirname + "/routes/admin2.js"))

app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))

const myMiddle = (req, res, next) => {
	res.locals = { ...res.locals, Jie: "哈囉" }
	res.locals.derrrr = 567
	next()
}

app.get("/try-middle", [myMiddle], (req, res) => {
	res.json(res.locals)
})

app.use((req, res) => {
	// res.type("text/plain")
	res.status(404).render("404")
})

// node_modules/bootstrap/dist/css/bootstrap.css

const port = process.env.SERVER_PORT || 3002
app.listen(port, () => {
	console.log(`server started,port:${port} `)
})
