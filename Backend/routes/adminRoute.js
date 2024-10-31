const express = require('express');
const router = express.Router();
const filesController=require('../controller/filesController')
const authController=require('../controller/authController')

router.get('/gettrashed', filesController.getFolderContentsFalse)
router.delete('/deleteShared/:sharedId', filesController.deleteTrashdFile)
router.post('/register',authController.register)

module.exports=router;