const controller=require('../controller/auth');
const filter=require('../controller/userController');
const {uploadSingleImage,resizeSingleFile} =require('../utils/image');

const express= require('express');
const router =express.Router();


router.route('/login').post(controller.login);
router.route('/signup').post(controller.signup);

router.use(controller.protected);
router.route('/get-me').get(controller.getLoggedUser);
router.route('/update-me')
    .patch(
        uploadSingleImage('image'),resizeSingleFile,controller.updateLoggedUser);

router.route('/delete-me')
    .delete(controller.deleteLoggedUser);

router.route('/update-pass').
    patch(controller.updateLoggedUserPassword)

router.route('/').get(filter.SchoolStudents,filter.getAllUsers)

module.exports = router;