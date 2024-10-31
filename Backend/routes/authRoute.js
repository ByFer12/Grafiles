const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Ruta para iniciar y cerrar sesión
router.post('/login', authController.login);
router.post('/logout', authController.logout);
module.exports = router;
