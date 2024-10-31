import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import '../../index.css'
const Porfile = () => {
    const [newPassword, setNewPassword] = useState("");
    const [currentPass, setCurrent] = useState("");
    const { user } = useUser();

const handlePas= async()=>{

    try {
        const response = await axios.put(
            "http://localhost:3000/employe/changePassword",
            {
                userId: user._id, // Coloca el ID del usuario aquí
                currentPassword: currentPass,
                newPassword: newPassword
            },
            { withCredentials: true }
        );
        alert(response.data.message);
        setNewPassword("")
        setCurrent("")
    } catch (error) {
        alert("Error al cambiar la contraseña: " + error.response.data.message);
    }
}

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <div
        className="content-container"
        style={{
          padding: "40px",
          borderRadius: "20px",
          marginTop: "100px",
          position: "relative",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
         <div
      style={{
        maxWidth: "600px",
        margin: "2px auto",
        padding: "0px",
        backgroundColor: "rgba(173, 216, 230, 0.3)", // Color celeste suave y transparente
        borderRadius: "12px",
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3 style={{ color: "#0288d1", fontWeight: "bold", textAlign: "center", marginBottom: "15px" }}>
        Información de Usuario
      </h3>

      <Form>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Nombre</Form.Label>
          <Form.Control type="text" defaultValue={user.nombre} disabled />
        </Form.Group>

        <Form.Group controlId="formRole" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Rol</Form.Label>
          <Form.Control type="text" defaultValue={user.rol} disabled />
        </Form.Group>

        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label style={{ color: "#0288d1", fontWeight: "bold" }}>Username</Form.Label>
          <Form.Control type="text" defaultValue={user.username} disabled />
        </Form.Group>

        <hr style={{ border: "1px solid #0288d1" }} />

        <h5 style={{ color: "#0288d1", fontWeight: "bold", marginBottom: "15px" }}>
          Cambiar Contraseña
        </h5>

        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Ingrese la contraseña actual"
            value={currentPass}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Ingrese nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>


        <Button
          variant="primary"
          style={{ width: "100%", backgroundColor: "#0288d1", border: "none" }}
          onClick={() => handlePas()}
        >
          Guardar Cambios
        </Button>
      </Form>
    </div>
      </div>
    </div>
  );
};

export default Porfile;
