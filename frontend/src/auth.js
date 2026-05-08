const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Acceso denegado, token requerido' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    // user contiene el payload del JWT (por ejemplo: { id, role })
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };