const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["folder"] },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visible: { type: Boolean, default: true },
},{collection:'trash'});

const Trash = mongoose.model('Trash', fileSchema);
module.exports = Trash;