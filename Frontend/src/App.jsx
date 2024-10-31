import { useState } from "react";
import { UserProvider } from "./components/context/userContext";
import Navbar from "./components/Navbar/Navigation";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/auth/protectedRoutes";
import Login from "./components/auth/Login";
import { Trash } from "./components/admin/Trash";
import AdDocument from "./components/employe/Documentos";
import Porfile from "./components/employe/Porfil";
import Shared from "./components/employe/Shared";
import Register from "./components/admin/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserProvider>
        <Router>
          <div>
            {/* Barra de navegación */}

            {/* Definir las rutas */}
            <Routes>
              <Route path="/" element={<Login />} />
              {/* Rutas protegidas */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    {console.log("HOlaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")}

                    <AdDocument />
                    <Navbar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-shared"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    {console.log("HOlaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")}

                    <Shared />
                    <Navbar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/porfil-admin"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    <Porfile />
                    <Navbar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trash-user"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    <Trash />
                    <Navbar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/adduser"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    <Register />
                    <Navbar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/directorio"
                element={
                  <ProtectedRoute roleRequired="EMPLEADO">
                    <AdDocument />
                    <Navbar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compartidos"
                element={
                  <ProtectedRoute roleRequired="EMPLEADO">
                    <Shared />
                    <Navbar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/porfil"
                element={
                  <ProtectedRoute roleRequired="EMPLEADO">
                    <Porfile />
                    <Navbar />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
