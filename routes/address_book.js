const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");
const upload = require(__dirname + "/../modules/upload-img");

router.use((req, res, next) => {
	next();
});

async function getListData(req, res) {
	const perPage = 10;
	let page = +req.query.page || 1;
	if (page < 1) {
		return res.redirect(req.baseUrl);
	}

	let search = req.query.search ? req.query.search.trim() : "";
	let where = `WHERE 1`;
	if (search) {
		where += ` AND 
		(
			\`name\` LIKE ${db.escape("%" + search + "%")}
			or
			\`address\` LIKE ${db.escape("%" + search + "%")}
		) `;
	}
	// res.type('text/plain; charset=utf-8')
	// return res.end(where);

	const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
	const [[{ totalRows }]] = await db.query(t_sql);
	let totalPages = 0;
	let rows = [];
	if (totalRows > 0) {
		totalPages = Math.ceil(totalRows / perPage);
		if (page > totalPages) {
			return res.redirect(`?page=${totalPages}`);
		}
		const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage},${perPage}`;

		[rows] = await db.query(sql);
	}

	// res.json({ totalRows, totalPages, perPage, page, rows });

	return { totalRows, totalPages, perPage, page, rows, search, query: req.query };
	// res.render("address_book/list", { totalRows, totalPages, perPage, page, rows , search , query:req.query });
}

// 新增資料

router.get("/add", async (req, res) => {
	res.locals.title = "新增資料 | " + res.locals.title;
	res.render("address_book/add");
});
router.post("/add", upload.none(), async (req, res) => {
	// res.send(req.body);
	const output = {
		success: false,
		code: 0,
		error: {},
		postData: req.body,
	};

	const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES(?,?,?,?,?,NOW())";
	const [result] = await db.query(sql, [req.body.name, req.body.email, req.body.mobile, req.body.birthday || null, req.body.address]);

	if (result.affectedRows) {
		output.success = true;
	}
	res.json(output);
});

// 修改資料

router.get("/edit/:sid", async (req, res) => {
	const sql = "SELECT * FROM address_book WHERE sid=?";
	const [rows] = await db.query(sql, [req.params.sid]);
	if (!rows || !rows.length) {
		return res.redirect(req.baseUrl); // 跳轉到列表頁
	}
	// res.json(rows[0])
	res.render('address_book/edit',rows[0])
});

router.put('/edit/:sid', async (req, res)=>{
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, // 除錯用
    };

    // TODO: 檢查欄位的格式, 可以用 joi

    const sql = "UPDATE `address_book` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=? WHERE `sid`=?";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
        req.params.sid
    ]);
    // console.log(result);
    // if(result.affectedRows) output.success = true;
    if(result.changedRows) output.success = true;

    res.json(output);

});

// 刪除功能

router.delete('/del/:sid', async (req, res)=>{
    const sql = " DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);
    
    res.json({success: !!result.affectedRows });
});

//console.log('-----------------------------------')

router.get(["/", "list"], async (req, res) => {
	const data = await getListData(req, res);
	// res.json({ totalRows, totalPages, perPage, page, rows });
	res.render("address_book/list", data);
});
router.get(["/api", "/api/list"], async (req, res) => {
	res.json(await getListData(req, res));
});

module.exports = router;
