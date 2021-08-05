const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.get("/", (req, res) => {
	Category.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.status(500).json({ error: err, success: false });
		});
});

router.post("/", (req, res) => {
	const { name } = req.body;

	let category = new Category({
		name,
	});

	console.log(req.body);
	category
		.save()
		.then((category) => {
			console.log(name);
			res.send(category);
		})
		.catch(() => {
			res.status(404).send("Category cannot be created");
		});
});

module.exports = router;
