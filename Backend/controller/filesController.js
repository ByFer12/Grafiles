const File = require('../models/File');
const Shared = require('../models/Shared');
const User = require('../models/User');

exports.createFolder = async (req, res) => {
  const { name, parentId, userId } = req.body;
  console.log("Datis legado: " + name + " Parent ID: " + parentId + " Usuario ID: " + userId)
  try {
    let parentFolder;
    if (!parentId) {
      parentFolder = await File.findOne({ createdBy: userId, type: 'folder', parentId: null });
      if (!parentFolder) {
        return res.status(400).json({ message: "No se encontró la carpeta raíz del usuario." });
      }
    } else {
      // Verifica si el `parentId` existe y pertenece al usuario
      parentFolder = await File.findOne({ _id: parentId, createdBy: userId, type: 'folder' });
      if (!parentFolder) {
        return res.status(400).json({ message: "Carpeta padre no encontrada o no pertenece al usuario." });
      }
    }


    // Crear la nueva carpeta
    const newFolder = new File({
      name,
      type: 'folder',
      parentId: parentFolder._id,
      createdBy: userId
    });

    await newFolder.save();

    res.status(201).json({ message: "Carpeta creada exitosamente.", folder: newFolder });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la carpeta: " + error.message });
  }
}
exports.updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name } = req.body;

  try {
    // Busca y actualiza la carpeta por su ID y modifica solo el nombre y la fecha de actualización
    const updatedFolder = await File.findByIdAndUpdate(
      folderId,
      {
        name,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedFolder) {
      return res.status(404).json({ message: "Carpeta no encontrada" });
    }

    res.status(200).json({ message: "Carpeta actualizada correctamente", folder: updatedFolder });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la carpeta: " + error.message });
  }
};


exports.createFile = async (req, res) => {
  const { name, parentId, userId, content, extension } = req.body;
  try {
    // Verifica si la carpeta padre existe
    let parentFolder = null;
    if (parentId) {
      parentFolder = await File.findOne({ _id: parentId, createdBy: userId, type: 'folder' });
      if (!parentFolder) {
        return res.status(400).json({ message: "Carpeta padre no encontrada o no pertenece al usuario." });
      }
    }

    // Crea el archivo
    const newFile = new File({
      name,
      type: 'file',
      parentId: parentFolder ? parentFolder._id : null,
      createdBy: userId,
      extension,
      content

    });

    await newFile.save();

    res.status(201).json({ message: "Archivo creado exitosamente.", file: newFile });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el archivo: " + error.message });
  }
};


exports.updateFile = async (req, res) => {
  const { fileId } = req.params;
  const { name, content, extension } = req.body;

  try {
    const updateFile = await File.findByIdAndUpdate(
      fileId,
      {
        name,
        content,
        extension,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updateFile) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.status(200).json({ message: "Actualizado correctamente", file: updateFile });


  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el archivo: " + error.message });
  }
}

//traer los archivos creados por un usuario y su visibilidad sea verdadera
exports.getFolderContents = async (req, res) => {
  const { userId, parentId } = req.query;

  try {
    // Si no hay `parentId`, busca en la carpeta raíz del usuario
    const query = {
      createdBy: userId,
      parentId: parentId || null, // null para la raíz
      visible: true
    };

    // Obtener los contenidos de la carpeta actual (subcarpetas y archivos)
    const folderContents = await File.find(query).lean();
    console.log("Obteniendo los folderes o archivos ");
    res.status(200).json({ folderContents });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el contenido de la carpeta: " + error.message });
  }
};

//Devuelve los arvhivos borrados es decir visible = false
exports.getFolderContentsFalse = async (req, res) => {
  const {parentId } = req.query;

  try {
    // Si no hay `parentId`, busca en la carpeta raíz del usuario
    const query = {
      visible: false,
      $or: [
        { type: "image" },
        { type: "file" }
      ]
    };

    // Obtener los contenidos de la carpeta actual (subcarpetas y archivos)
    const folderContents = await File.find(query).lean();
    console.log("Obteniendo los folderes o archivos ");
    res.status(200).json({ folderContents });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el contenido de la carpeta: " + error.message });
  }
};
//metodo para extraer todoso los archivos compartidos de un usuario en especifico
exports.getFolderContentsShared = async (req, res) => {
  const { userId, parentId } = req.query;

  try {
    // Si no hay `parentId`, busca en la carpeta raíz del usuario
    const query = {
      createdBy: userId,
      parentId: parentId || null, // null para la raíz
      visible: true
    };
    // Obtener los contenidos de la carpeta actual (subcarpetas y archivos)
    const folderContents = await Shared.find(query).lean();
    console.log("Obteniendo los folderes o archivos ");
    res.status(200).json({ message:"compartidos obtenidos", compartidos:folderContents });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el contenido de la carpeta: " + error.message });
  }
};


exports.moveFileOrFolder = async (req, res) => {
  const { fileId } = req.params; // ID del archivo a "mover"
  const { parentId, userId } = req.body; // ID del usuario que realiza la acción y el id del folder a mover

  try {
    // Busca el archivo y verifica que pertenece al usuario
    const file = await File.findOne({ _id: fileId, createdBy: userId });

    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado o no pertenece al usuario." });
    }

    // Actualiza el campoparentID 
    file.parentId = parentId;
    file.updatedAt = Date.now();
    await file.save();


    res.status(200).json({ message: "Archivo moido exitosamente (cambio de estado)." });
  } catch (error) {
    res.status(500).json({ error: "Error al mover el archivo: " + error.message });
  }
};

exports.deleteFile = async (req, res) => {
  const { fileId } = req.params;
  const { userId } = req.body;

  try {
    // Busca el archivo y verifica que pertenece al usuario
    const file = await File.findOne({ _id: fileId, createdBy: userId });

    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado o no pertenece al usuario." });
    }

    // Cambia `visible` a false en el archivo actual
    file.visible = false;
    file.updatedAt = Date.now();
    await file.save();

    // Si el archivo es una carpeta, llama a la función recursiva para ocultar subcarpetas y subarchivos
    if (file.type === 'folder') {
      await hideAllSubfiles(fileId);
    }

    res.status(200).json({ message: "Archivo eliminado exitosamente (cambio de estado)." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el archivo: " + error.message });
  }
};

async function hideAllSubfiles(fileId) {
  // Encuentra todos los archivos o carpetas que tienen `fileId` como `parentId`
  const subFiles = await File.find({ parentId: fileId });

  // Itera sobre cada subarchivo o subcarpeta y actualiza `visible` a false
  for (const subFile of subFiles) {
    subFile.visible = false;
    await subFile.save();

    // Llama recursivamente a la función para manejar subcarpetas
    await hideAllSubfiles(subFile._id);
  }
}

exports.copyFolderOrFileToShare = async (req, res) => {
  const { userId, nombre, parentId, itemId } = req.body;
  try {
    const item = await File.findOne({ _id: itemId, createdBy: userId })

    if (!item) {
      return res.status(400).json({ message: "Archivo o carpeta no encontrado" })
    }

    const user = await User.findOne({sharedId: parentId})

    console.log("Intentando copiar: ", item);
    let item2 = await Shared.findOne({ parentId: parentId, sharedBy: userId })

    if (!item2) {
      const newFolder = new Shared({
        name: "Con " + nombre,
        type: 'folder',
        parentId: parentId,
        createdBy: user._id,
        sharedBy:userId
      });
      await newFolder.save();
      item2 = newFolder;
    }


    const copiarCarpeta = await duplicarCarpetatoShare(userId,user._id, item, item2);

    res.status(200).json({ message: "Duplicado correctamente", compartido: copiarCarpeta })

  } catch (error) {
    res.status(500).json({ error: "Error al copiar el elemento: " + error.message });
  }

}

async function duplicarCarpetatoShare(userId, userShared,item, padre) {
  const itemName = item.name;
  console.log("Copiando... Nombre a compartidos :: " + itemName)
  const newItem =   new Shared({
    name: itemName,
    type: item.type,
    parentId: padre._id,
    createdBy: userShared,
    sharedBy:userId,
    extension: item.extension,
    content: item.content
  })
  await newItem.save();
  return newItem;
}

exports.copyFolderOrFile = async (req, res) => {
  const { userId, parentId, itemId, nombre } = req.body;
  try {
    const item = await File.findOne({ _id: itemId, createdBy: userId })

    if (!item) {
      return res.status(400).json({ message: "Archivo o carpeta no encontrado" })
    }
    console.log("Intentando copiar: ", item);
    const copiarCarpeta = await duplicarCarpeta(userId, item, parentId, nombre);

    res.status(200).json({ message: "Duplicado correctamente", copia: copiarCarpeta })

  } catch (error) {
    res.status(500).json({ error: "Error al copiar el elemento: " + error.message });
  }

}

async function duplicarCarpeta(userId, item, parentId, nombre = null) {
  const itemName = nombre !== null ? nombre : item.name;
  console.log("Copiando... Nombre:: " + itemName)
  const newItem = new File({
    name: itemName,
    type: item.type,
    parentId: parentId,
    createdBy: userId,
    extension: item.extension,
    content: item.content
  })
  await newItem.save();
  if (item.type === 'folder') {

    const hijo = await File.find({ parentId: item._id, createdBy: userId });
    for (const child of hijo) {
      await duplicarCarpeta(userId, child, newItem._id); // Sin `newName` en subcarpetas o archivos
    }

  }
  return newItem;
}


//carga de imagenes jpg y png
exports.uploadImage = async (req, res) => {
  const { name, extension, imageData, parentId, userId } = req.body;

  try {
    const newFile = new File({
      name,
      type: 'image',
      createdBy: userId,  // Asegúrate de que el usuario esté autenticado
      parentId: parentId,
      extension: extension, // Puedes actualizar esto para que detecte diferentes formatos
      imageData
    });

    await newFile.save();
    res.status(200).json({ message: "Imagen guardada correctamente", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la imagen", error: error.message });
  }
};

exports.getImage = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.status(200).json({ 
      name: file.name, 
      extension: file.extension, 
      imageData: file.imageData 
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen", error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  const { fileId } = req.params;
  const { name, extension, imageData } = req.body;

  try {
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      {
        name,
        extension,
        imageData,
      },
      { new: true } // Para que devuelva el documento actualizado
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.status(200).json({ message: "Imagen actualizada correctamente", file: updatedFile });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la imagen", error: error.message });
  }
};




exports.deleteSharedFile = async (req, res) => {
  const { sharedId } = req.params; // ID del archivo o carpeta a eliminar
  const { userId } = req.body; // ID del usuario que realiza la acción

  try {
    // Verifica si el archivo o carpeta compartida pertenece al usuario que realiza la solicitud
    const sharedItem = await Shared.findOne({ _id: sharedId, createdBy: userId });

    if (!sharedItem) {
      return res.status(404).json({ message: "Archivo o carpeta compartida no encontrado o no pertenece al usuario." });
    }

    // Elimina el archivo o carpeta compartida de la base de datos
    await Shared.deleteOne({ _id: sharedId });

    res.status(200).json({ message: "Archivo o carpeta compartida eliminada exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el archivo o carpeta compartida: " + error.message });
  }
};

exports.deleteTrashdFile = async (req, res) => {
  const { sharedId } = req.params; // ID del archivo o carpeta a eliminar

  try {
    // Verifica si el archivo o carpeta compartida pertenece al usuario que realiza la solicitud
    const sharedItem = await Shared.findOne({ _id: sharedId});

    if (!sharedItem) {
      return res.status(404).json({ message: "Archivo o carpeta compartida no encontrado o no pertenece al usuario." });
    }

    // Elimina el archivo o carpeta compartida de la base de datos
    await Shared.deleteOne({ _id: sharedId });

    res.status(200).json({ message: "Archivo o carpeta compartida eliminada exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el archivo o carpeta compartida: " + error.message });
  }
};
