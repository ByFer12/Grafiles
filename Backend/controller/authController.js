const bcrypt = require('bcryptjs')
const User = require('../models/User');
const File = require('../models/File');
const Shared = require('../models/Shared');


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Buscar usuario por nombre de usuario
        const user = await User.findOne({ username });
        console.log('Intentando iniciar sesión...');

        console.log("Usuaro encontrado: ", user);
        // Verificar si el usuario existe y la contraseña es correcta
        if (user && await user.comparePassword(password)) {
            console.log("Paso la comparacion de contrasenia... ");
            req.session.userId = user._id; // Guarda el ID de usuario en la sesión
            req.session.rol = user.rol; // Guarda el rol de usuario en la sesión

            const rootFolder = await File.findOne({ createdBy: user._id, type: 'folder', parentId: null });
            res.status(200).json({ message: 'Sesión iniciada correctamente', user, rootFolder });

        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Esto es error de login " + error.message });
    }
};


exports.register = async (req, res) => {
    const { nombre, username, password, rol } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }


        // Crear el nuevo usuario
        const newUser = new User({
            nombre,
            username,
            password,
            rol
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Crear la carpeta raíz para el nuevo usuario
        const rootFolder = new File({
            name: 'root',
            type: 'folder',
            parentId: null,  // Representa que es la carpeta raíz
            createdBy: newUser._id, // ID del nuevo usuario
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await rootFolder.save();
        // crear una carpeta donde iran los compartidos
        const compartido = new Shared({
            name: 'compartido',
            type: 'folder',
            parentId: null,  
            createdBy: newUser._id, 
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await compartido.save();

        newUser.rootId = rootFolder._id;
        newUser.sharedId = compartido._id;
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: "Esto fue lo que paso" + error.message });
    }
};
//metodo para extraer todos los empleados
exports.getEmpleados = async (req, res) => {
    try {
        
        const empleados = await User.find({ rol: 'EMPLEADO' });
        if (!empleados) {
            return res.status(404).json({ message: "Usuarios no encontrado." });
        }
        res.status(200).json({message:"Empleados encontrados",employes:empleados});
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los empleados: " + error.message });
    }
};
//metodo para extraer todos los admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ rol: 'ADMIN' });
        if (!admins) {
            return res.status(404).json({ message: "Admins no encontrado." });
        }
        res.status(200).json({message:"Admins encontrados", admin:admins});
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los administradores: " + error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Buscar al usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Verificar que la contraseña actual sea correcta
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta." });
        }

        // Actualizar la contraseña del usuario
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar la contraseña: " + error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión', error: err });
        }
        res.clearCookie('connect.sid'); // Limpia la cookie de sesión
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
};