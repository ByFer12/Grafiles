import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Form,
  ModalBody,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaFolder, FaFileAlt, FaImage, FaHtml5, FaRegImage } from "react-icons/fa";

import BtnBack from "./btnBack";

import { useUser } from "../context/userContext";
import axios from "axios";

const AdDocument = () => {
  const { user, rootFolder } = useUser();

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [itemType, setItemType] = useState(""); // "folder" o "file"
  const [fileContent, setFileContent] = useState(""); // Contenido del editor
  const [items, setItems] = useState([]); // Arreglo para almacenar los elementos creados
  const [itemName, setItemName] = useState(""); // Nombre del archivo o carpeta
  const [fileExtension, setFileExtension] = useState("txt"); // Extensión del archivo
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [regresar, setRegresaar] = useState([]);
  const [itemA, setItemA] = useState([]);
  const [update, setUpdate] = useState(false);
  const [upFile, setFileUpdate] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [fileShared, setFileShared] = useState("");
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [imag, setImag] = useState("");
  const [ext, setExt] = useState("");
  const [isEditting, setIsEditting] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const [item, setItem] = useState();

  const fetchFolderContents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/employe/getarchivos",
        {
          params: { userId: user._id, parentId: currentFolderId },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(
          "Respuesta de los archivos: ",
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

  //Metodo para regresar
  const handleBack = () => {
    regresar.pop();

    setCurrentFolderId(regresar[regresar.length - 1]);
    fetchFolderContents();
    console.log("Volviendo a la carpeta anterior...");
    // Implementa tu lógica para regresar aquí
  };

  useEffect(() => {
    fetchFolderContents();
  }, [user._id, currentFolderId]);

  // Cambiar de carpeta al hacer clic en una subcarpeta o abrir archivos
  const handleFolderClick = (folder) => {
    setItem(folder);
    if (folder.type === "folder") {
      setCurrentFolderId(folder._id);
      regresar.push(folder._id);
      fetchFolderContents();
    } else if (folder.type === "image") {
      handleImageClick(folder);
    } else {
      // console.log("Este es un archivo mula ");
      setUpdate(true);
      setFileUpdate(folder);

      setItemType("file");
      setShowModal(true);
      setItemName(folder.name);
      setFileExtension(folder.extension);
      setFileContent(JSON.parse(folder.content));
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

  const handleEditFolder = (folder) => {
    setUpdate(true);
    setItemType("folder");
    setShowModal(true);
    setItemName(folder.name);
    setFileUpdate(folder);
  };

  const handleShow = (action) => {
    setItemName("");
    setSelectedAction(action);
    setItemType(action === "Crear Carpeta" ? "folder" : "file");
    setShowModal(true);
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, itemId: null });
  };

  useEffect(() => {
    document.addEventListener("click", handleCloseContextMenu);
    return () => document.removeEventListener("click", handleCloseContextMenu);
  }, []);

  const handleClose = () => {
    setItem("");
    setShowModal(false);
    setShowModal2(false);
    setShowModal3(false);
    setShowModal4(false);
    setFileContent(""); // Limpiar contenido al cerrar
    setItemName("");
  };

  function duplicate(arr) {
    const nombres = new Set(); // Almacena nombres únicos
    for (const obj of arr) {
      if (obj.name === itemName && obj.type === itemType) {
        console.log("Contieneeeeeeeee: ", obj.name);
        return true; // Se encontró un nombre duplicado
      }
      nombres.add(obj.name); // Agrega el nombre al conjunto
    }
    return false; // No se encontraron duplicados
  }

  const handleSave = () => {
    if (itemType === "folder") {
      if (duplicate(items)) {
        alert("No pueden carpetas con el mismo nombre");
        return;
      }
      saveFolder();
    } else if (itemType === "file") {
      handleSaveFile();
    }
  };

  const handleSaveFile = async () => {
    const nom = itemName.replace(/ /g, "\n");
    if (update) {
      console.log("Contexto: ", upFile);
      try {
        const response = await axios.put(
          `http://localhost:3000/employe/updateFile/${upFile._id}`,
          {
            name: nom,
            content: JSON.stringify(fileContent),
            extension: fileExtension,
          },
          { withCredentials: true }
        );

        setItemName("");
        setFileExtension("");
        setFileContent("");
        setUpdate(false);
        setShowModal(false);
        fetchFolderContents();
        console.log("Archivo actualizado exitosamente:", response.data);
      } catch (error) {
        console.error("Error al actualizar archivo:", error);
      }
    } else {
      if (duplicate(items)) {
        alert("No pueden archivos con el mismo nombre");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/employe/crearFile",
          {
            name: nom,
            parentId: currentFolderId,
            userId: user._id,
            content: JSON.stringify(fileContent), // El contenido Delta completo
            extension: fileExtension,
          },
          {
            withCredentials: true, // Asegúrate de incluir las credenciales (cookies) de la sesión
          }
        );

        console.log("Archivo creado exitosamente.");
        setItemName("");
        setFileExtension("");
        setFileContent("");
        setUpdate(false);
        setShowModal(false);
        fetchFolderContents();
      } catch (error) {
        console.error(
          "Error al crear archivo:",
          error.response?.data || error.message
        );
      }
    }
  };

  const saveFolder = async () => {
    const nom = itemName.replace(/ /g, "\n");
    if (update) {
      if (currentFolderId === null) {
        alert("No puedes eliminar el root");
        return;
      }
      try {
        // Llamada a la API para actualizar el nombre de la carpeta

        const response = await axios.put(
          `http://localhost:3000/employe/editarFolder/${upFile._id}`,
          { name: nom },
          { withCredentials: true } // Incluye credenciales (cookies o tokens) si es necesario
        );

        console.log("Carpeta actualizada:", response.data);
        setUpdate(false);
        setShowModal(false);
        fetchFolderContents();
        setItemName("");
      } catch (err) {
        console.log("Error al actualizar folder: ", err);
      }
    } else {
      const folderData = {
        name: nom,
        parentId: currentFolderId,
        userId: user._id,
      };

      try {
        // Hacer la solicitud POST al backend con axios
        const response = await axios.post(
          "http://localhost:3000/employe/crearFolder",
          folderData,
          {
            withCredentials: true, // Asegúrate de incluir las credenciales (cookies) de la sesión
          }
        );

        // Manejar la respuesta del servidor
        const data = response.data;

        console.log(" respuesta de creacion: ", data);
        setUpdate(false);
        setShowModal(false);
        fetchFolderContents();
        setItemName("");
      } catch (error) {
        console.error(
          "Error en la solicitud:",
          error.response ? error.response.data.error : error.message
        );
      }
    }
  };

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    [{ script: "sub" }, { script: "super" }], // Superíndice y subíndice
    ["code-block"], // Opción para un bloque de código
  ];

  const deleteFile = async (item) => {
    if (currentFolderId === null) {
      alert("No puedes eliminar el root");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/employe/deleteFile/${item._id}`,
        { userId: user._id }, // Incluye el ID del usuario en el cuerpo de la solicitud
        { withCredentials: true }
      );
      console.log("Respuesta de eliminado< ", response.data);
      fetchFolderContents();
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };
  const modules = {
    toolbar: toolbarOptions,
  };

  const handleContentChange = (content, delta, source, editor) => {
    const fileContent = editor.getContents(); // Obtener el contenido en formato Delta
    setFileContent(fileContent); // Almacena el contenido Delta en tu estado
  };

  const handleCopy = async (req, res) => {
    console.log("id del item: ", item._id);
    const datas = {
      userId: user._id,
      parentId: currentFolderId,
      itemId: item._id,
      nombre: itemName,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/employe/duplicateItem",
        datas,
        { withCredentials: true }
      );

      console.log("Respuesta de copia: ", response.data);
      fetchFolderContents();

      setItemName("");
      setShowModal2(false);
    } catch (error) {
      console.error(
        "Error en la solicitud:",
        error.response ? error.response.data.error : error.message
      );
    }
  };
  const handleComp = (item) => {
    setItem(item);
    setShowModal2(true);
  };

  const handleMove = async () => {
    console.log("Carpeta donde se guardara: ", item);
    console.log("Carpeta que se va a mover: ", itemA);
    if (currentFolderId === null) {
      alert("No puedes mover la carpeta root");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/employe/mover/${itemA._id}`,
        { parentId: item._id, userId: user._id },
        { withCredentials: true }
      );
      fetchFolderContents();
      setShowModal3(false);
      console.log("Se ha movido: ", response.data);
    } catch (error) {
      console.log("Ha habido un error al intntar mover: ", error);
    }
  };
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    // Aquí accedemos al archivo completo (Blob)
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name.split(".")[0];
      const fileExtension = file.name.split(".")[1];

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        if (isEditting && imag) {
          // Llama a la función para actualizar la imagen existente
          await updateImageInBackend(
            imag,
            base64String,
            fileName,
            fileExtension
          );
        } else {
          // Llama a la función para subir una nueva imagen
          await uploadImageToBackend(base64String, fileName, fileExtension);
        }
      };

      reader.readAsDataURL(file); // Aquí pasamos el archivo Blob en lugar del nombre
    } else {
      console.log("No se seleccionó ningún archivo.");
    }
  };

  const uploadImageToBackend = async (
    base64String,
    fileName,
    fileExtension
  ) => {
    try {
      console.log("Subiendo imagen");
      const response = await axios.post(
        "http://localhost:3000/employe/upload-image",
        {
          name: fileName,
          extension: fileExtension,
          imageData: base64String,
          parentId: currentFolderId,
          userId: user._id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        fetchFolderContents();
        console.log("Imagen subida correctamente:", response.data);
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error.message);
    }
  };

  const handleImageUploadClick = () => {
    setIsEditting(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCompartir = async (item) => {
    console.log("Lo que se va a compartir: ", item);
    console.log("Usuario: ", user.nombre);
    setItem(item);
    try {
      const response = await axios.get(
        "http://localhost:3000/employe/getemployes",
        { withCredentials: true }
      );
      console.log("Respuesta de usuarios: ", response.data.employes);
      setUsuarios(response.data.employes);
    } catch (error) {
      alert("error al obtener usuarios: ", error);
    }
    setShowModal4(true);
  };

  const handleShare = async () => {
    console.log("Usuario selecionado: ", fileShared);
    const data = {
      userId: user._id,
      nombre: user.nombre,
      parentId: fileShared,
      itemId: item._id,
    };
    if (fileShared === "") {
      alert("Debes seleccionar a un usuario ");
      return;
    }
    console.log("Usuariooooo: ", user.nombre);
    try {
      const response = await axios.post(
        "http://localhost:3000/employe/shared",
        data,
        { withCredentials: true }
      );
      console.log("Menaje del servidor al compartir", response.data);
      setItem(null);
      setFileShared(null);
      setShowModal4(false);
    } catch (error) {
      alert("Error al compartir: ", error);
    }
  };

  const handleEditClick = (fileId) => {
    setIsEditting(true);
    setImag(fileId._id); // Almacena el ID del archivo que se está editando
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Abre el explorador de archivos
    }
  };

  const updateImageInBackend = async (
    fileId,
    base64String,
    fileName,
    fileExtension
  ) => {
    try {
      console.log("Editando ");
      const response = await axios.put(
        `http://localhost:3000/employe/update-image/${fileId}`, // Usa PUT para actualizar
        {
          name: fileName,
          extension: fileExtension,
          imageData: base64String,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchFolderContents(); // Refresca la lista de archivos
        console.log("Imagen actualizada correctamente:", response.data);
      }
    } catch (error) {
      console.error("Error al actualizar la imagen:", error.message);
    }
  };

  return (
    <div className="main-container" style={{ margin: "80px" }}>
      <BtnBack rootFolder={rootFolder} onBack={handleBack} />
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
        {/* Botón de creación con dropdown */}
        <DropdownButton
          id="dropdown-basic-button"
          title="+"
          variant="success"
          className="btn-create"
        >
          <Dropdown.Item onClick={() => handleShow("Crear Carpeta")}>
            Crear Carpeta
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleShow("Crear Archivo")}>
            Crear Archivo
          </Dropdown.Item>
          <Dropdown.Item onClick={handleImageUploadClick}>
            Cargar imagen
          </Dropdown.Item>
        </DropdownButton>
        {/* Input de archivo oculto para cargar imágenes */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg, .png" // Acepta solo archivos .jpg y .png
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Contenedor de ítems */}
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

              {/* Opciones específicas según el tipo */}
              {contextMenu.item.type === "folder" && (
                <>
                  <div onClick={() => handleEditFolder(contextMenu.item)}>
                    Editar Nombre
                  </div>
                  <div onClick={() => handleComp(contextMenu.item)}>
                    Hacer una copia
                  </div>
                  <div
                    onClick={() => {
                      setShowModal3(true);
                      setItemA(contextMenu.item);
                    }}
                  >
                    Mover
                  </div>
                </>
              )}

              {contextMenu.item.type === "file" && (
                <>
                  <div onClick={() => handleCompartir(contextMenu.item)}>
                    Compartir
                  </div>
                  <div onClick={() => handleComp(contextMenu.item)}>
                    Hacer una copia
                  </div>
                  <div
                    onClick={() => {
                      setShowModal3(true);
                      setItemA(contextMenu.item);
                    }}
                  >
                    Mover
                  </div>
                </>
              )}

              {/* Opciones limitadas para los elementos de tipo "image" */}
              {contextMenu.item.type === "image" && (
                <>
                  <div onClick={() => handleEditClick(contextMenu.item)}>
                    Editar
                  </div>
                </>
              )}

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

      {/**MODAAL 4 */}
      <Modal show={showModal4} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleccione a la persona a quien compartirle</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-5">
            <label htmlFor="copyOptions" className="form-label">
              Compartir con
            </label>
            <select
              className="form-select"
              id="copyOptions"
              value={fileShared}
              onChange={(e) => {
                setFileShared(e.target.value);
              }}
            >
              <option value="">
                --------------------seleccione--------------------
              </option>

              {/* Renderizamos los usuarios filtrados */}
              {usuarios
                .filter((u) => u._id !== user._id)
                .map((u) => (
                  <option key={u._id} value={u.sharedId}>
                    {u.nombre}
                  </option>
                ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleShare}>
            Compartir
          </Button>
        </Modal.Footer>
      </Modal>

      {/*MODAL 3 */}
      <Modal show={showModal3} onHide={handleClose} centered size="lg">
        <Modal.Header>
          <Modal.Title>Seleccione la carpeta donde quiere moverse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 style={{ marginLeft: "100px" }}>
            Guardar en: <strong>{item?.name || ""}</strong>
          </h3>
          <BtnBack rootFolder={rootFolder} onBack={handleBack} />

          <div className="item-container d-flex flex-wrap mt-3">
            <br />

            {items
              .filter((item) => item.type === "folder") // Filtra solo las carpetas
              .map((item, index) => (
                <div
                  key={index}
                  onDoubleClick={() => handleFolderClick(item)}
                  className="item position-relative"
                  style={{ cursor: "pointer", margin: "10px" }} // Añadir margen para separación
                >
                  {/* Icono de carpeta */}
                  <FaFolder size={50} color="#7cded7" />

                  {/* Nombre del ítem */}
                  <small
                    style={{
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </small>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleMove}>
            Mover
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Modal 2*/}
      <Modal show={showModal2} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Copiando</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre de la copia
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={`Ingrese el nombre ${
                  itemType === "folder" ? "de la carpeta" : "del archivo"
                }`}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCopy}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedAction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre {itemType === "folder" ? "de Carpeta" : "de Archivo"}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={`Ingrese el nombre ${
                  itemType === "folder" ? "de la carpeta" : "del archivo"
                }`}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            {/* Selector de Extensión para Archivos */}
            {itemType === "file" && (
              <>
                <div className="mb-3">
                  <label htmlFor="extension" className="form-label">
                    Extensión
                  </label>
                  <Form.Select
                    id="extension"
                    value={fileExtension}
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
                    onChange={handleContentChange}
                    modules={modules}
                    placeholder="Escriba el contenido del archivo aquí"
                    style={{ height: "350px" }}
                  />
                </div>
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdDocument;
