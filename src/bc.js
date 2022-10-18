const bcrypt = require("bcryptjs");
(async () => {
	const h = await bcrypt.hash("123456",10);
	console.log(h);
    const hashStr = '$2a$10$/2H5G/A09DDSZhwmBBo8dO02BiLFMUeRQuzj0eAVFi5xeo3Bwi4ce'
    console.log(await bcrypt.compare('123456',hashStr));
})();
