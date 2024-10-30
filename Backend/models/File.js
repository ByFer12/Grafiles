const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["folder", "file","image"] },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    visible: { type: Boolean, default: true },
    
    // Campos específicos para archivos
    extension: { type: String, required: function() { return this.type === "file"|| this.type === "image";}},
    content: { type: String, required: function() { return this.type === "file"; }},
    imageData: { type: String, required: function() { return this.type === "image"; }}
},{collection:'files'});

const File = mongoose.model('File', fileSchema);
module.exports = File;

