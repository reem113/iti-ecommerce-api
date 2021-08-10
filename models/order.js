const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	orderItems: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "OrderItem",
			required: true,
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	shippingAddress: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address",
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	totalPrice: {
		type: Number,
	},
	status: {
		type: String,
		default: "Pending",
	},
	dateOrdered: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
