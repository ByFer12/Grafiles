import axios from "axios";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import BtnBack from "../employe/btnBack";
import { FaFileAlt, FaFolder, FaHtml5, FaRegImage } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";

export const Trash = () => {
  const { user, rootFolder } = useUser();
  const [items, setItems] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [regresar, setRegresaar] = useState([]);
  const [itenName, setItemName] = useState("");
  const [fileEstension, setFileExtension] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [ext, setExt] = useState("");
  const [showModal5, setShowModal5] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const handleFolderClick = (folder) => {

    if(folder.type==='file'){
      setShowModal(true);
      setItemName(folder.name);
      setFileExtension(folder.extension);
      setFileContent(JSON.parse(folder.content));
    }else{
    
      handleImageClick(folder);
    }
  };
  const handleImageClick = async (fileId) => {
    console.log("Tipo del archivo: ", fileId);
    try {
      const response = await axios.get(
        `http://localhost:3000/employe/getImage/${fileId._id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Respuesta imagen: ", response.data);
        setImageData(
          `data:image/${response.data.extension};base64,${response.data.imageData}`
        );
        setImageName(response.data.name);
        setExt(response.data.extension);
        setShowModal5(true);
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error.message);
    }
  };

  const fetchFolderContents = async () => {

    try {
      const response = await axios.get(
        "http://localhost:3000/admin/gettrashed",
        {
          params: { parentId: currentFolderId },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(
          "Respuesta de los TRAsh: ",
          response.data.folderContents
        );
        const folders = response.data.folderContents;
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
  //esto sirve para que al hacerle click a las opciones desaparezca
  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, itemId: null });
  };
  useEffect(() => {
    document.addEventListener("click", handleCloseContextMenu);
    return () => document.removeEventListener("click", handleCloseContextMenu);
  }, []);
  useEffect(()=>{
    fetchFolderContents();
  },[user._id, currentFolderId])


  const deleteFile = async (item) => {
    if (currentFolderId === null) {
      alert("No puede elimianr la carpeta principal");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:3000/employe/deleteShared/${item._id}`,
        // Incluye el ID del usuario en el cuerpo de la solicitud
        {
          withCredentials: true,
        }
      );
      console.log("Respuesta de eliminado> ", response.data);
      fetchFolderContents();
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const handleClose = () => {
    setShowModal(false);
    setFileContent(""); // Limpiar contenido al cerrar
    setItemName("");
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
                  x: rect.right - 110, // Posición cercana a la derecha del ítem
                  y: rect.top - 110,
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
              ) : item.type === "image" ? (
                <FaRegImage size={50} color="#9071ef" />
              ) : item.extension === "txt" ? (
                <FaFileAlt size={50} color="#2196F3" />
              ) : item.extension === "html" ? (
                <FaHtml5 size={50} color="#E44D26" /> // Icono para archivos HTML
              ) : (
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

            {/**MODAL5 ver imagen */}
            <Modal show={showModal5} onHide={() => setShowModal5(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{imageName + "." + ext}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageData} alt={imageName} style={{ width: "100%" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal5(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

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
