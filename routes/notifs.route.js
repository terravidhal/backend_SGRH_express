const { router } = require('../configs/app.config');

const notifsController = require('../src/controllers/notifications.controller');
const notifsValidation = require('../utils/validations/notifs.validation');
const authMiddleware = require('../utils/middlewares/auth/auth.middleware');

router.post('/creates',  authMiddleware.loginUser, notifsController.createNotifications);
router.patch('/updateStatus',authMiddleware.loginAdminManager, notifsController.ChangeStatusNotif);
router.get('/responseNotifs', authMiddleware.loginUser, notifsController.findAllResponseNotifsUser); 
router.get('/allNotifs', authMiddleware.loginAdminManager, notifsController.findAllNotifsStatusSend); 
router.get('/OneNotifs/:id', authMiddleware.loginUser, notifsController.findOneNotifsById); 
router.delete('/deleteNotif', authMiddleware.loginUser, notifsController.deleteNotifications); 


module.exports = router;