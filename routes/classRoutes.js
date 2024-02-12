const controller=require('../controller/classController');
const {protected,allowedTo} = require('../controller/auth');
const express= require('express');
const router =express.Router();

router.use(protected);
router.route('/')
    .post(allowedTo('school'),controller.addSchoolIdToBody,controller.createClass)
    .get(allowedTo('school','student'),controller.getAllClasses);
router.route('/:id')
    .get(allowedTo('school','student'),controller.getClass)
    .patch(allowedTo('school'),controller.accessClass,controller.updateClass)
    .delete(allowedTo('school'),controller.accessClass,controller.deleteClass);

router.route('/add-student').patch(allowedTo('school'),controller.addStudentToClass);
router.route('/remove-student').patch(allowedTo('school'),controller.removeStudentFromClass);

module.exports = router;