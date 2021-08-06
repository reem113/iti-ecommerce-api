const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	address: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
		},
	],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
