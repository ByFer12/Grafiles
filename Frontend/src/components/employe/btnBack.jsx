import React from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa"; // Importa el icono de flecha

const BtnBack = ({ rootFolder, onBack }) => {
  return (
    <div>
      <Button 
        variant="link" // Cambia a "link" para un estilo de botón más sutil
        onClick={onBack} // Llama a la función onBack cuando se hace clic
        style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }} // Estilo opcional
      >
        <FaArrowLeft style={{ marginRight: '5px' }} /> {/* Icono de flecha */}
        Regresar
      </Button>
    </div>
  );
};

export default BtnBack;
