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
	// populate category inside product inside orderItems
	// populate only name, email and phone for user

	Order.findById(req.params.id)
		.populate({ path: "orderItems", populate: { path: "product", populate: "category" } })
		.populate("user", "name email phone")
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

router.post("/", async (req, res) => {
	const { orderItems, user, shippingAddress, phone } = req.body;

	const orderItemsIds = await Promise.all(
		orderItems.map(async (orderItem) => {
			let newOrderItem = new OrderItem({
				product: orderItem.product,
				quantity: orderItem.quantity,
			});

			newOrderItem = await newOrderItem.save();

			return newOrderItem._id;
		})
	);

	const totalPrices = await Promise.all(
		orderItemsIds.map(async (orderItemId) => {
			const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");
			const totalPrice = orderItem.product.price * orderItem.quantity;
			return totalPrice;
		})
	);

	const totalPrice = totalPrices.reduce((accumulator, current) => accumulator + current, 0);

	let order = new Order({
		orderItems: orderItemsIds,
		user,
		shippingAddress,
		phone,
		totalPrice,
	});

	order = await order.save();

	if (!order) return res.status(400).send("the order cannot be created!");

	res.send(order);
});

router.delete("/:id", (req, res) => {
	Order.findByIdAndRemove(req.params.id)
		.then(async (order) => {
			if (!order) {
				return res.status(404).json({ success: false, message: "Requested order was not found!" });
			}

			//deleting orderItems for this order
			await order.orderItems.map(async (orderItem) => {
				await OrderItem.findByIdAndRemove(orderItem);
			});
			return res.status(200).json({ success: true, message: "Order has been deleted!" });
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err });
		});
});

// get orders of specific user
router.get("/user/:id", (req, res) => {
	Order.find({ user: req.params.id })
		.populate({
			path: "orderItems",
			populate: { path: "product", populate: "category" },
		})
		.then((userOrders) => {
			if (!userOrders) {
				return res.status(404).json({ message: "Orders of the given user id was not found!" });
			}
			return res.status(200).send(userOrders);
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
