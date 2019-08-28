const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: { type: String, required: true },
	defaultCurrency: { type: String, required: true },
	splitQuantity: { type: Number, required: true }
});

module.exports = mongoose.model("User", userSchema);