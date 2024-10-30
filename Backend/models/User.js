const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

//aqui definimos el esquema de usuario
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    rol: { type: String, enum: ["ADMIN", "EMPLEADO"] },
    rootId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },  // Referencia a la carpeta raíz
    sharedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shared' }
}, { collection: 'usuarios' })


//middleware qe se ejecuta antes de guardar un usuario
userSchema.pre('save', async function (next) { // Cambiar a función normal
    const user = this; // Ahora `this` se refiere correctamente al documento de usuario
    if (!user.isModified('password')) return next(); // Solo encripta si la contraseña ha cambiado

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt); // Encripta la contraseña
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar la contraseña en el login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
