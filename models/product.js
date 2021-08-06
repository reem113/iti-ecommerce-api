const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	shortDescription: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: "",
	},
	images: [
		{
			type: String,
		},
	],
	brand: {
		type: String,
		default: "Generic",
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	countInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 250,
	},
	reviews: [
		{
			type: String,
		},
	],
	rating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5,
	},
	isFeatured: {
		type: Boolean,
		default: false,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
