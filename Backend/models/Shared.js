const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["folder", "file"] },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    visible: { type: Boolean, default: true },
        
    // Campos específicos para archivos
    extension: { type: String, required: function() { return this.type === "file"; }},
    content: { type: String, required: function() { return this.type === "file"; }}
},{collection:'shared'});

const Shared = mongoose.model('Shared', fileSchema);
module.exports = Shared;