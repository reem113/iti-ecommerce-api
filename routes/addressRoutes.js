const express = require("express");
const router = express.Router();

const Address = require("../models/address");
const User = require("../models/user");

router.get("/", (req, res) => {
	Address.find()
		.then((addressList) => {
			res.status(200).json({ success: true, addressList });
		})
		.catch((err) => {
			res.status(500).json({ success: false, error: err });
		});
});

router.get("/:id", (req, res) => {
	Address.findById(req.params.id)
		.then((address) => {
			if (!address) {
				return res.status(404).json({ success: false, message: "Address with the given id was not found!" });
			}
			return res.status(200).json({ success: true, address });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.post("/", (req, res) => {
	const { _userId, apartment, street, city, country, zip } = req.body;

	let address = new Address({
		_userId,
		apartment,
		street,
		city,
		country,
		zip,
	});

	address
		.save()
		.then((address) => {
			User.findByIdAndUpdate(
				_userId,
				{ $push: { address } },
				{ useFindAndModify: false, new: true },
				(err, user) => {
					if (err) {
						console.log(err);
						res.send(err);
					} else {
						console.log("Updated User: ", user);
						res.json(user);
					}
					// res.send(address);
				}
			);
			// .then((user) => {
			// 	res.json(user);
			// })
			// .catch((err) => {
			// 	res.send(err);
			// });
		})
		.catch((err) => {
			res.status(500).json({ success: false, err });
		});
});

router.put("/:id", (req, res) => {
	const { apartment, street, city, country, zip } = req.body;
	Address.findByIdAndUpdate(
		req.params.id,
		{
			apartment,
			street,
			city,
			country,
			zip,
		},
		{
			new: true,
		}
	)
		.then((address) => {
			if (!address) {
				return res.status(404).json({ success: false, message: "Address with the given id was not found!" });
			}
			return res.status(200).json({ success: true, address });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.delete("/:id", (req, res) => {
	Address.findByIdAndRemove(req.params.id)
		.then((address) => {
			if (!address) {
				return res.status(404).json({ success: false, message: "Requested address was not found!" });
			}
			return res.status(200).json({ success: true, message: "Address has been deleted!" });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

module.exports = router;
