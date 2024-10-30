import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí haces la petición a tu backend
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Inicio de sesion: ", response.data);
      const userData = response.data.user; // Esto depende de la respuesta de tu backend
      const rootFolder = response.data.rootFolder;
      login(userData, rootFolder); // Guardar el usuario en el contexto

      // Redirigir según el rol del usuario
      if (userData.rol === "ADMIN") {
        navigate("/admin");
      } else if (userData.rol === "EMPLEADO") {
        navigate("/directorio");
      }
    } catch (error) {
      setMessage("Credenciales invalidas");
      console.error("Error en el login", error);
    }
  };

  return (
    <div className="col-md-4" style={{ margin: "130px" }}>
      <div
        className="card shadow"
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          border: "2px solid rgba(52, 152, 219, 0.5)", // Borde suave
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo blanco con transparencia
          backdropFilter: "blur(20px)", // Efecto de desenfoque del fondo
          padding: "20px",
        }}
      >
        <div
          className="card-body p-5"
          style={{ backgroundColor: "transparent" }}
        >
          <h3
            className="text-center mb-4"
            style={{ fontWeight: "600", color: "#2c3e50", textAlign: "center" }}
          >
            Bienvenido a GraFiles
          </h3>
          <form onSubmit={handleSubmit}>
            <p className="text-danger text-center">{message}</p>
            <div className="mb-5" style={{ marginBottom: "15px" }}>
              <label
                className="form-label"
                style={{ color: "#34495e", marginLeft: "25px" }}
              >
                Username:{" "}
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  padding: "10px 15px",
                  borderRadius: "8px",
                  border: "1px solid #dcdde1",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                placeholder="Ingresa tu email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-5">
              <label
                className="form-label"
                style={{ color: "#34495e", marginLeft: "35px" }}
              >
                Contraseña:{" "}
              </label>
              <input
                type="password"
                className="form-control"
                style={{
                  padding: "10px 15px",
                  borderRadius: "8px",
                  border: "1px solid #dcdde1",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  marginBottom: "10px",
                }}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                backgroundColor: "#3498db",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                boxShadow: "0 4px 8px rgba(52,152,219,0.2)",
                cursor: "pointer",
                marginBottom: "10px",
                marginLeft: "45px",
              }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
