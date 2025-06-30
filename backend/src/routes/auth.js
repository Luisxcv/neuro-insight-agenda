
const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registro de usuario
router.post('/register', register);

// POST /api/auth/login - Inicio de sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
