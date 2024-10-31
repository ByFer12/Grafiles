const express = require('express');
const router = express.Router();
const filesController=require('../controller/filesController')
const authController=require('../controller/authController')

router.post('/crearFolder', filesController.createFolder );
router.post('/crearFile', filesController.createFile );
router.post('/duplicateItem', filesController.copyFolderOrFile);
router.post("/upload-image", filesController.uploadImage);
router.post("/shared", filesController.copyFolderOrFileToShare);


router.put('/updateFile/:fileId', filesController.updateFile);
router.put('/deleteFile/:fileId', filesController.deleteFile);
router.put('/editarFolder/:folderId', filesController.updateFolder)
router.put('/changePassword', authController.changePassword);
router.put('/mover/:fileId', filesController.moveFileOrFolder);

router.get("/getarchivos", filesController.getFolderContents);
router.get("/getfilesshared", filesController.getFolderContentsShared);
router.get("/getemployes", authController.getEmpleados);
router.get("/getImage/:fileId", filesController.getImage);
router.put("/update-image/:fileId", filesController.updateImage);


router.delete('/deleteShared/:sharedId', filesController.deleteSharedFile)


module.exports=router;