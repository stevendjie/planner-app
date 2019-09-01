const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    quantity: { type: Number, required: true },
    value: { type: Number, required: true },
    // name: { type: String, required: true },
    isPersonal: { type: Boolean, required: true },
    details: { type: String, required: true },
    currency: { type: String, required: true },
    splitQuantity: { type: Number, required: false }
});

module.exports = mongoose.model("Entry", entrySchema);