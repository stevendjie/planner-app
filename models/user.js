const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: { type: String, required: true },
	displayCurrency: { type: String, required: true },
	// splitQuantity: { type: Number, required: true },
	rates: { type: Object, required: false }
});

module.exports = mongoose.model("User", userSchema);