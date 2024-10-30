import BtnBack from "./btnBack";
import "../../index.css";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { FaFileAlt, FaFolder, FaImage } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";

const Shared = () => {
  const [items, setItems] = useState([]);
  const [itenName, setItemName] = useState("");
  const [fileEstension, setFileExtension] = useState("");
  const [fileContent,setFileContent]= useState("")
  const { user, rootFolder } = useUser();
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [regresar, setRegresaar]=useState([]);
  const [showModal, setShowModal]=useState(false)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });
  const fetchFolderContents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/employe/getfilesshared",
        {
          params: { userId: user._id, parentId: currentFolderId },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Respuesta de los compartidos: ", response.data.compartidos);
        const folders = response.data.compartidos;
        setItems(folders);
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

  const handleFolderClick = (folder) => {
    if (folder.type === "folder") {
      setCurrentFolderId(folder._id);
      regresar.push(folder._id);
      fetchFolderContents();
    } else {
    
     
      setShowModal(true);
      setItemName(folder.name);
      setFileExtension(folder.extension);
      setFileContent(JSON.parse(folder.content));
    }
  };
  useEffect(() => {
    fetchFolderContents()
  }, [user._id, currentFolderId]);

  //esto sirve para que al hacerle click a las opciones desaparezca
  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, itemId: null });
  };
  useEffect(() => {
    document.addEventListener("click", handleCloseContextMenu);
    return () => document.removeEventListener("click", handleCloseContextMenu);
  }, []);

  const handleBack = () => {
    regresar.pop();

    setCurrentFolderId(regresar[regresar.length - 1]);
    fetchFolderContents();
    console.log("Volviendo a la carpeta anterior...");
    // Implementa tu lógica para regresar aquí
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"]
    ]
  };

  const handleClose = () => {
    setShowModal(false);
    setFileContent(""); // Limpiar contenido al cerrar
    setItemName("");
  };

  const deleteFile=async(item)=>{
    if(currentFolderId===null){
        alert("No puede elimianr la carpeta principal");
        return;
    }
    try {
        const response = await axios.delete(
          `http://localhost:3000/employe/deleteShared/${item._id}`,
          { userId: user._id }, // Incluye el ID del usuario en el cuerpo de la solicitud
          { withCredentials: true }
        );
        console.log("Respuesta de eliminado> ", response.data);
        fetchFolderContents();
      } catch (error) {
        console.error("Error al eliminar el archivo:", error);
      }
  }
  return (
    <div className="main-container" style={{ margin: "80px" }}>
      <BtnBack rootFolder={rootFolder} onBack={handleBack}/>
      <div
        className="content-container"
        style={{
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
          position: "relative",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
                <div className="item-container d-flex flex-wrap mt-3">
          {contextMenu.visible && (
            <div
              style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
                zIndex: 1000,
                padding: "10px",
                cursor: "pointer",
              }}
              onMouseLeave={() =>
                setContextMenu({ ...contextMenu, visible: false })
              }
            >
              <div onClick={() => handleFolderClick(contextMenu.item)}>
                Abrir
              </div>

              {/* La opción Eliminar siempre está disponible al final */}
              <div onClick={() => deleteFile(contextMenu.item)}>Eliminar</div>
            </div>
          )}{" "}
          {items.map((item, index) => (
            <div
              key={index}
              onContextMenu={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect(); // Coordenadas del ítem
                setContextMenu({
                  visible: true,
                  x: rect.right - 100, // Posición cercana a la derecha del ítem
                  y: rect.top - 100,
                  item,
                });
              }}
              onDoubleClick={() => handleFolderClick(item)}
              className="item position-relative"
              style={{ cursor: "pointer", margin: "10px" }} // Añadir margen para separación
            >
              {/* Icono de carpeta o archivo */}
              {item.type === "folder" ? (
                <FaFolder size={50} color="#7cded7" />
              )  : (
                <FaFileAlt size={50} color="#2196F3" />
              )}
              {/* Nombre del ítem */}
              <small
                style={{
                  display: "block",
                  textAlign: "center",
                }}
              >
                {item.name}
                {item.extension ? `.${item.extension}` : ""}
              </small>
            </div>
          ))}
        </div>
      </div>



      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Archivo de solo lectura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre del archivo
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                disabled
                value={itenName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
              <>
                <div className="mb-3">
                  <label htmlFor="extension" className="form-label">
                    Extensión
                  </label>
                  <Form.Select
                  disabled
                    id="extension"
                    value={fileEstension}
                    onChange={(e) => setFileExtension(e.target.value)}
                  >
                    <option value="txt">.txt</option>
                    <option value="docx">.docx</option>
                    <option value="html">.html</option>
                  </Form.Select>
                </div>

                {/* Editor de Texto Enriquecido */}
                <div className="mb-5">
                  <label className="form-label">Editor de Archivo</label>
                  <ReactQuill
                    theme="snow"
                    value={fileContent}
                    readOnly={true}
                    modules={modules}
                    placeholder="Escriba el contenido del archivo aquí"
                    style={{ height: "350px" }}
                  />
                </div>
              </>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Shared;
