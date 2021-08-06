const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	apartment: {
		type: String,
		default: "",
	},
	street: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	zip: {
		type: String,
		default: "",
	},
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
