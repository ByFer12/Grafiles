exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.status(401).json({ message: 'Inicia sesion primero middleware' });
  };
  
  exports.isRole = (role) => (req, res, next) => {
    console.log("Rol sesion: "+req.session.rol+" Rol comprobado "+role);
    if (req.session.rol === role) {
      return next();
    }
    res.status(403).json({message:`Acceso denegado, permitir solo a ${role}`});
  };
  