require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const moment = require("moment-timezone");
const router = require("./routes/address_book");
const db = require(__dirname + "/modules/db_connect2");
const sessionStore = new MysqlStore({}, db);
const cors = require('cors')

express.Jie = "您好Jie";

// const multer = require("multer")
// const upload = multer({ dest: "tmp_uploads/" })
const upload = require(__dirname + "/modules/upload-img");
const fs = require("fs").promises;

const app = express();

app.set("view engine", "ejs");
app.use(cors())
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: "dwqlekqwekrkv23023wedfghu8790oijhjkl",
		store: sessionStore,
		cookie: {
			maxAge: 1_200_000,
		},
	})
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
	// template helper functions
	res.locals.toDateString = (d) => {
		return moment(d).format("YYYY-MM-DD");
	};
	res.locals.toDatetimeString = (d) => {
		return moment(d).format("YYYY-MM-DD HH:mm:ss");
	};
	next();
});

// routes 路由器
app.get("/", (req, res) => {
	// res.send(`<h2>你好</h2>`)
	res.render("main", { name: "Jie" });
});

app.get("/sales-json", (req, res) => {
	const sales = require(__dirname + "/data/sales.json");
	console.log(sales);
	res.render(`sales-json`, { sales });
});

app.get("/json-test", (req, res) => {
	// res.send({ name: '小新1', age: 30 });
	res.json({ name: "小新2", age: 30 });
});

app.get("/try-qs", (req, res) => {
	res.json(req.query);
});

app.post("/try-post", (req, res) => {
	res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
	res.render("try-post-form");
});

app.post("/try-post-form", (req, res) => {
	res.render("try-post-form", req.body);
});

app.post("/try-upload", upload.single("avatar"), async (req, res) => {
	res.json(req.file);
	// if (req.file && req.file.originalname) {
	// 	await fs.rename(req.file.path, `public/img/${req.file.originalname}`)
	// 	res.json(req.file)
	// } else {
	// 	res.json({ msg: "沒有上傳檔案" })
	// }
});

app.post("/try-upload2", upload.array("photos"), async (req, res) => {
	res.json(req.files);
});

app.get("/my-params1/:action?/:id?", async (req, res) => {
	res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
	let u = req.url.slice(3);
	u = u.split("?")[0]; // 去掉 query string
	u = u.split("-").join("");
	res.json({ mobile: u });
});

app.use("/admin2", require(__dirname + "/routes/admin2.js"));

const myMiddle = (req, res, next) => {
	res.locals = { ...res.locals, Jie: "哈囉" };
	res.locals.derrrr = "123";
	next();
};

app.get("/try-middle", [myMiddle], (req, res) => {
	res.json(res.locals);
});

app.get("/try-session", (req, res) => {
	req.session.aaa ||= 0;
	req.session.aaa++;
	res.json(req.session);
});

app.get("/try-date", (req, res) => {
	const fm = "YYYY-MM-DD HH:mm:ss";
	const m = moment("06/10/22", "DD/MM/YY");

	res.json({
		m,
		m1: m.format(fm),
		m2: m.tz("Europe/London").format(fm),
	});
});

app.get("/try-db", async (req, res) => {
	const [rows] = await db.query("SELECT * FROM `address_book` WHERE 1 ORDER BY sid DESC ");
	res.json(rows);
});
app.get("/try-db-add", async (req, res) => {
	const name = "你才是林克";
	const email = "link@gmail.com";
	const mobile = "0929222666";
	const birthday = "1990-02-07";
	const address = "宜蘭市";
	const sql = "INSERT INTO `address_book`(`name`,`email`,`mobile`,`birthday`,`address`,`created_at`)VALUES(?,?,?,?,?,NOW())";
	const [result] = await db.query(sql, [name, email, mobile, birthday, address]);
	res.json(result);
});
app.get("/try-db-add2", async (req, res) => {
	const name = "你全家都林克";
	const email = "link@gmail.com";
	const mobile = "0929222666";
	const birthday = "1990-02-07";
	const address = "宜蘭市";
	const sql = "INSERT INTO `address_book` SET ?";
	const [result] = await db.query(sql, [{ name, email, mobile, birthday, address, created_at: new Date() }]);
	res.json(result);
});

// app.get("/ab", (req, res) => {
// 	res.render("ab")
// })
app.use("/ab", require(__dirname + "/routes/address_book"));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

app.use((req, res) => {
	// res.type("text/plain")
	res.status(404).render("404");
});

// node_modules/bootstrap/dist/css/bootstrap.css

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
	console.log(`server started,port:${port} `);
});
