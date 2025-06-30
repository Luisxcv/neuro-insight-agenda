
// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      // Si roles es un string, convertirlo a array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este recurso'
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificación de rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

// Middleware para verificar que el médico esté aprobado
const requireApprovedDoctor = (req, res, next) => {
  try {
    if (req.user.role === 'doctor' && !req.user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta de médico está pendiente de aprobación'
      });
    }

    next();
  } catch (error) {
    console.error('Error verificando aprobación de médico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  requireRole,
  requireApprovedDoctor
};
