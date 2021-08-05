const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.get("/", (req, res) => {
	Category.find()
		.then((categoryList) => {
			res.status(200).send(categoryList);
		})
		.catch((err) => {
			res.status(500).json({ error: err, success: false });
		});
});

router.get("/:id", (req, res) => {
	Category.findById(req.params.id)
		.then((category) => {
			if (!category) {
				return res.status(404).json({ message: "Category with the given id was not found!" });
			}
			return res.status(200).send(category);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.post("/", (req, res) => {
	const { name } = req.body;

	let category = new Category({
		name,
	});

	category
		.save()
		.then((category) => {
			res.send(category);
		})
		.catch(() => {
			res.status(404).send("Category cannot be created");
		});
});

router.put("/:id", (req, res) => {
	const { name } = req.body;
	Category.findByIdAndUpdate(
		req.params.id,
		{
			name,
		},
		{
			new: true,
		}
	)
		.then((category) => {
			if (!category) {
				return res.status(404).json({ message: "Category with the given id was not found!" });
			}
			return res.status(200).send(category);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.delete("/:id", (req, res) => {
	Category.findByIdAndRemove(req.params.id)
		.then((category) => {
			if (!category) {
				return res.status(404).json({ success: false, message: "Requested category was not found!" });
			}
			return res.status(200).json({ success: true, message: "Category has been deleted!" });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

module.exports = router;
