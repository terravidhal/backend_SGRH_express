const BaseService = require("./base.service");
const Tasks = require("../models/tasks.model");

class TasksService extends BaseService {

    static instance;
    constructor() {
        if (TasksService.instance) return TasksService.instance;
        super(Tasks);
        TasksService.instance = this;
    }

    /**
     * @returns { TasksService }
     */
    static getInstance() {
        if (!TasksService.instance) TasksService.instance = new TasksService();
        return TasksService.instance;
    }

    async createTasks(data) {
        try {
            const task = await super.create(data); 
            return task;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async updateTasks(taskId, data) {
        try {
            const filter = { _id: taskId };
            const update = await super.update(filter, data); 
            return update;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }
    
    async ResolvedTasks(dataObj) {
        try {
            const taskId = dataObj.id
            const filter = { _id: taskId };
            const data = {status : "RESOLVED"}
            const update = await super.update(filter, data); 
            return update;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async deleteTasks(taskId, data) {
        try {
            const filter = { _id: taskId };
            const deletes = await super.delete(filter, data); 
            return deletes;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async findAllTasksBy(filter, query = {}) {
        try {
            const tasks = await super.find(filter, query); 
            return tasks;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async findOneTasksBy(filter, query = {}) {
        try {
            const task = await super.findOne(filter, query); 
            return task;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async findAllTasks(query = {}) { // filter {} empty object
        try {
            const results = await super.findAllNoFilter({}, query);
            return results;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

}

module.exports = TasksService.getInstance();
