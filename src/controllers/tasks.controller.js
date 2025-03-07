const Controller = require('./controller');
const taskService = require('../services/tasks.service');


class TasksController extends Controller {

    static instance;
    constructor() {
        if (TasksController.instance) return TasksController.instance;
        super();
        TasksController.instance = this;
    }

    /**
     * @returns { TasksController }
     */
    static getInstance() {
        if (!TasksController.instance) TasksController.instance = new TasksController();
        return TasksController.instance;
    }

    async createTasks (req, res, next) {
        const response = await taskService.createTasks(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'Task created successfully', data, 201);
    };

    async ResolvedTasks (req, res, next) {
        const response = await taskService.ResolvedTasks(req.body); 
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'Task updated successfully', data, 201);
    };

    async findAllTasksByUserIdPending (req, res, next) {
        const userId = req.auth._id 
        const filter = { $and: [{ userId: userId }, { status: 'PENDING'  }] };
        const response = await taskService.findAllTasksBy(filter);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'Tasks by userid', data, 201);
    }

    async findAllTasksByUserIdResolved (req, res, next) {
        const userId = req.auth._id 
        const filter = { $and: [{ userId: userId }, { status: 'RESOLVED' }] };
        const response = await taskService.findAllTasksBy(filter);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'Tasks by userid', data, 201);
    }

}

module.exports = TasksController.getInstance();
