const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

router.get("/", (req, res) => {
	Order.find()
		.populate("orderItems")
		.populate("user")
		.populate("shippingAddress")
		.then((orderList) => {
			res.status(200).send(orderList);
		})
		.catch((err) => {
			res.status(500).json({ error: err, success: false });
		});
});

router.get("/:id", (req, res) => {
	Order.findById(req.params.id)
		.populate("orderItems")
		.populate("user")
		.populate("shippingAddress")
		.then((order) => {
			if (!order) {
				return res.status(404).json({ message: "Order with the given id was not found!" });
			}
			return res.status(200).send(order);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.post("/", (req, res) => {
	const { orderItems, user, shippingAddress, phone, totalPrice } = req.body;

	const orderItemsIdsPromise = Promise.all(
		orderItems.map(async (orderItem) => {
			let newOrderItem = new OrderItem({
				product: orderItem.product,
				quantity: orderItem.quantity,
			});

			newOrderItem = await newOrderItem.save();

			return newOrderItem._id;
		})
	);

	const orderItemsIds = await orderItemsIdsPromise;

	let order = new Order({
		orderItemsIds,
		user,
		shippingAddress,
		phone,
		totalPrice,
	});

	order
		.save()
		.then((order) => {
			if (!order) {
				return res.status(500).json({ success: false, message: "The order cannot be created" });
			}
			return res.send(order);
		})
		.catch((err) => {
			return res.status(400).json({ success: false, message: err });
		});
});

router.delete("/:id", (req, res) => {
	Order.findByIdAndRemove(req.params.id)
		.then((order) => {
			if (!order) {
				return res.status(404).json({ success: false, message: "Requested order was not found!" });
			}
			return res.status(200).json({ success: true, message: "Order has been deleted!" });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

// get all order count
router.get("/get/count", (req, res) => {
	Order.countDocuments()
		.then((count) => {
			if (!count) {
				return res.status(400).json({ message: "Couldn't get order count!" });
			}
			return res.status(200).json({ orderCount: count });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

module.exports = router;
