import { Link } from "react-router-dom";
import { useUser } from "../context/userContext"; // Importa el contexto del usuario
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaFolder, FaHome, FaPowerOff, FaShare, FaShareSquare, FaUser } from "react-icons/fa";
function Navbar() {
  const { user, logout } = useUser(); // Obtén el usuario y la función de logout desde el contexto
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/logout", {
        withCredentials: true, // Asegúrate de incluir las credenciales (cookies) de la sesión
      });
      console.log("Cerrando sesion: ", response.data);
      console.log("hola");
      logout();
      navigate("/");
    } catch (error) {}
  };
  // console.log("usuario: ",user.user);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "0.5rem 1rem",
          marginBottom: "75px",
        }}
      >
        <div className="container">
          {/* Logo/Nombre */}
          <span
            style={{
              fontWeight: "500",
              color: "#333",
            }}
          >
            {user ? (
              <>
                Hola, <span style={{ color: "#4f46e5" }}>{user.nombre}</span>
              </>
            ) : (
              "OlaKeTal"
            )}
          </span>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              border: "none",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Contenido del navbar */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Links para EMPLEADO */}
            {user && user.rol === "EMPLEADO" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/directorio"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    <FaFolder title="Documenos personales" style={{ fontSize: '1.9rem', marginRight: "3rem" }}/>
                  
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/compartidos"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        marginTop:"20px"
                      }}
                    >
                     
                      <FaShare

                        title="Documenos compartidos"
                        style={{
                          position: "absolute",
                          bottom: "-9px",
                          right: "-5px",
                          color: "#4f46e5",
                          fontSize: "2rem",
                          
                        }}
                      />
                   
                    </div>
                   
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/porfil"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    <FaUser title="Informacion de perfil" style={{ fontSize: '1.9rem', marginLeft: "3rem" }}/>
                  </Link>
                </li>
              </ul>
            )}

            {/* Links para ADMIN */}
            {user && user.rol === "ADMIN" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/admin"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/post-aprobar"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    Aprobar post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/report-apribar"
                    style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                  >
                    Compartidos
                  </Link>
                </li>
              </ul>
            )}

            {/* Links de autenticación */}
            <ul className="navbar-nav ms-auto">
              {!user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      style={{
                        color: "#4b5563",
                        margin: "0 0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f3f4f6";
                        e.target.style.color = "#4f46e5";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#4b5563";
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/register"
                      style={{
                        color: "white",
                        backgroundColor: "#4f46e5",
                        margin: "0 0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#4338ca";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#4f46e5";
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    className="nav-link btn"
                    onClick={handleLogout}
                    style={{
                      color: "#dc2626",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#fee2e2";
                      e.target.style.color = "#b91c1c";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#dc2626";
                    }}
                  >
                    Cerrar Sesion
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
