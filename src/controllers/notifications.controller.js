const Controller = require('./controller');
const notificationsService = require('../services/notifications.service');

  
class NotificationsController extends Controller {

    static instance;
    constructor() {
        if (NotificationsController.instance) return NotificationsController.instance;
        super();
        NotificationsController.instance = this;
    }

    /**
     * @returns { NotificationsController }
     */
    static getInstance() {
        if (!NotificationsController.instance) NotificationsController.instance = new NotificationsController();
        return NotificationsController.instance;
    }

    async createNotifications (req, res, next) {
      //  const userId = req.auth._id 
        const response = await notificationsService.createNotifications(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'notifications created successfully', data, 201);
    };

    async ChangeStatusNotif (req, res, next) {
        const response = await notificationsService.ChangeStatusNotif(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'notifications updated successfully', data, 201);
    };

    async findAllResponseNotifsUser (req, res, next) {
        const userIdConnect = req.auth._id 
        const filter = { $and: [{ userId: userIdConnect }, { status: { $in: ['PENDING', 'RESOLVED'] } }] };
        const response = await notificationsService.findAllNotifsBy(filter);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'all notifications by userid', data, 201);
    }

    async findAllNotifsStatusSend (req, res, next) {
        const filter = { status:"SEND"};
        const response = await notificationsService.findAllNotifsBy(filter);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'all notifs', data, 201);
    }

    async findOneNotifsById (req, res, next) {
        const filter = { _id: req.params.id};
        const response = await notificationsService.findOneNotifsBy(filter);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'one notifs', data, 201);
    }

    async deleteNotifications (req, res, next) {
        const response = await notificationsService.deleteNotifications(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'notifications deleted successfully!!', data, 201);
    }
}

module.exports = NotificationsController.getInstance();
