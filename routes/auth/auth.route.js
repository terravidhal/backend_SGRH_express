const { router } = require('../../configs/app.config');

const authController = require('../../src/controllers/auth/auth.controller');
const authValidation = require('../../utils/validations/auth.validation');
const authMiddleware = require('../../utils/middlewares/auth/auth.middleware');

router.post('/register', authValidation.register, authController.register);
router.post('/activate-account', authValidation.activate_account, authController.activate_account);
router.post('/login', authValidation.login, authController.login);
router.post('/addEmployee',authMiddleware.loginAdmin, authController.createEmployee);
router.patch('/update',authMiddleware.loginUser, authController.updateUser);
router.patch('/updateImg',authMiddleware.loginUser, authController.updateImgProfile);
router.get('/userDetails',authMiddleware.loginUser, authController.findOneUserById);
router.get('/employee',authMiddleware.loginAdminManager, authController.findAllUsersEmployee);
router.get('/oneUser',authMiddleware.loginUser, authController.findOneUserById);
router.get('/oneUserInTable/:id',authMiddleware.loginUser, authController.findOneUserByIdInTable);
router.delete('/deleteEmploy', authMiddleware.loginUser, authController.deleteEmployee); 





module.exports = router;
