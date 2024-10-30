import { Button, Modal } from "react-bootstrap";
import BtnBack from "./btnBack";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";
import { FaFileAlt, FaFolder } from "react-icons/fa";

const SelectedF = () => {
  const [itemsF, setItemsF] = useState([]);
  const { user, rootFolder, showModal3, closeModal3 } = useUser();
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [regresar, setRegresaar] = useState([]);

  const fetchFolderContents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/employe/getfolders",
        {
          params: { userId: user._id, parentId: currentFolderId },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const folders = response.data.folderContents;
        setItemsF(folders);
      } else {
        console.error(
          "Error al obtener el contenido de la carpeta:",
          response.data.message
        );
      }
    } catch (error) {
      console.error(
        "Error en la solicitud:",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  const handleBack = () => {
    regresar.pop();

    setCurrentFolderId(regresar[regresar.length - 1]);
    fetchFolderContents();
    console.log("Volviendo a la carpeta anterior...");
    // Implementa tu lógica para regresar aquí
  };

  const handleMove = () => {
    console.log("Moviendo");
  };

  useEffect(() => {
    fetchFolderContents();
  }, []);
  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder._id);
    regresar.push(folder._id);
    fetchFolderContents();
  };
  return (
    <div>
      <Modal show={showModal3} onHide={closeModal3} centered size="lg">
        <Modal.Header>
          <Modal.Title>Seleccione la carpeta donde quiere moverse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BtnBack rootFolder={rootFolder} onBack={handleBack} />
          <div className="item-container d-flex flex-wrap mt-3">
            {itemsF.map((item, index) => (
              <div
                key={index}
                onDoubleClick={() => handleFolderClick(item)}
                className="item position-relative"
                style={{ cursor: "pointer", margin: "10px" }}
              >
                {item.type === "folder" ? (
                  <FaFolder size={50} color=" #7cded7" />
                ) : (
                  <FaFileAlt size={50} color="#2196F3" />
                )}
                <small style={{ display: "block", textAlign: "center" }}>
                  {item.name}
                  {item.extension ? `.${item.extension}` : ""}
                </small>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal3}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleMove}>
            Mover
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectedF;
