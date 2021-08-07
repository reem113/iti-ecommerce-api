const express = require("express");
const router = express.Router();

const User = require("../models/user");

// package for password hashing before storing in the database
const bcrypt = require("bcryptjs");

// package to generate an access token for the user on login
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
	User.find()
		.populate("address")
		.select("-passwordHash")
		.then((userList) => {
			res.status(200).send(userList);
		})
		.catch((err) => {
			res.status(500).json({ error: err, success: false });
		});
});

router.get("/:id", (req, res) => {
	User.findById(req.params.id)
		.populate("address")
		.select("-passwordHash")
		.then((user) => {
			if (!user) {
				return res.status(404).json({ message: "User with the given id was not found!" });
			}
			return res.status(200).send(user);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.post("/register", (req, res) => {
	const { name, email, password, phone, isAdmin } = req.body;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.HASH_SALT)));

	let user = new User({
		name,
		email,
		passwordHash,
		phone,
		isAdmin,
	});

	user.save()
		.then((user) => {
			res.send(user);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.put("/:id", (req, res) => {
	const { name, email, passwordHash, phone, isAdmin } = req.body;
	User.findByIdAndUpdate(
		req.params.id,
		{
			name,
			email,
			passwordHash,
			phone,
			isAdmin,
		},
		{
			new: true,
		}
	)
		.then((user) => {
			if (!user) {
				return res.status(404).json({ message: "User with the given id was not found!" });
			}
			return res.status(200).send(user);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.delete("/:id", (req, res) => {
	User.findByIdAndRemove(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status(404).json({ success: false, message: "Requested user was not found!" });
			}
			return res.status(200).json({ success: true, message: "User has been deleted!" });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email })
		.then((user) => {
			if (!user) return res.status(400).json({ success: false, message: "This email doesn't exist!" });
			if (!bcrypt.compareSync(password, user.passwordHash)) {
				return res
					.status(400)
					.json({ success: false, message: "Authentication failed, password is incorrect!" });
			} else {
				const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
					expiresIn: "1d",
				});
				res.status(200).json({ userEmail: user.email, userId: user._id, token });
			}
		})
		.catch((err) => {
			// console.log(err);
			res.status(400).json({ success: false, message: err });
		});
});

module.exports = router;
