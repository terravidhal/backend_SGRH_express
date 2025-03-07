const { router } = require('../configs/app.config');

const tasksController = require('../src/controllers/tasks.controller');
const tasksValidation = require('../utils/validations/tasks.validation');
const authMiddleware = require('../utils/middlewares/auth/auth.middleware');

router.post('/create', tasksValidation.createTasks,authMiddleware.loginAdminManager, tasksController.createTasks);
router.get('/byuserid/pending',authMiddleware.loginUser,  tasksController.findAllTasksByUserIdPending);
router.get('/byuserid/resolved',authMiddleware.loginUser,  tasksController.findAllTasksByUserIdResolved);
router.patch('/resolved',authMiddleware.loginUser,  tasksController.ResolvedTasks);

module.exports = router;
