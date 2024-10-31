import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const Register = () => {

    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [message, setMessage]=useState("")
  
    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
          setPasswordError('Las contraseñas no coinciden');
          return;
        } 
    
        try {
          setPasswordError('');
          
          // Enviar solicitud POST con Axios
          const response = await axios.post('http://localhost:3000/admin/register', {
            nombre,
            username,
            password,
          },
          {
            withCredentials:true
          }
          
          );
    
          // Mostrar mensaje según la respuesta

            setMessage('Registro exitoso');

          setNombre("")
          setPassword("")
          setConfirmPassword("")
          setUsername("")
        } catch (error) {
          setMessage('Error en el registro');
          console.error("Error al registrar el usuario:", error);
        }
      };
  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div
        className="content-container"
        style={{
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          position: "relative",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
 <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "rgba(173, 216, 230, 0.2)",
        borderRadius: "12px",
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 136, 209, 0.2)"
      }}
    >
      <h3 style={{ color: "#0288d1", fontWeight: "bold", textAlign: "center", marginBottom: "15px" }}>
        Registro de Usuario
      </h3>

      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirme su contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {passwordError}
            </div>
          )}
        </Form.Group>

        {message && (
          <div style={{ color: message === 'Registro exitoso' ? "green" : "red", marginTop: "10px" }}>
            {message}
          </div>
        )}

        <Button
          variant="primary"
          type="submit"
          style={{ width: "100%", backgroundColor: "#0288d1", border: "none" }}
        >
          Registrarse
        </Button>
      </Form>
    </div>
        
      </div>
    </div>
  );
};

export default Register;
