const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	displayCurrency: { type: String, required: true },
	splitQuantity: { type: Number, required: true },
});

module.exports = mongoose.model("Group", groupSchema);