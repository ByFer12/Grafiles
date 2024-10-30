const Register = () => {
    return (  
        <div className="col-md-4" style={{ margin: '280px' }}>
  <div className="card shadow" style={{ 
      borderRadius: '15px', 
      overflow: 'hidden',
      border: '1px solid rgba(52, 152, 219, 0.5)', // Borde suave
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco con transparencia
      backdropFilter: 'blur(10px)', // Efecto de desenfoque del fondo
  }}>
    <div className="card-body p-5" style={{ backgroundColor: 'transparent' }}>
      <h3 className="text-center mb-4" style={{ fontWeight: '600', color: '#2c3e50' }}>Registro</h3>
      <form onSubmit={handleSubmit}>
        <p className="text-danger text-center">{message}</p>
        
        <div className="mb-4">
          <label className="form-label" style={{ color: '#34495e' }}>Nombre</label>
          <input
            type="text"
            className="form-control"
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #dcdde1',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ color: '#34495e' }}>Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #dcdde1',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ color: '#34495e' }}>Contraseña</label>
          <input
            type="password"
            className="form-control"
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #dcdde1',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ color: '#34495e' }}>Rol</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #dcdde1',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <option value="" disabled>Selecciona tu rol</option>
            <option value="employee">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: '#3498db',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 8px rgba(52,152,219,0.2)',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  </div>
</div>
    
    );
}
 
export default Register;
