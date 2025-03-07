const BaseService = require("./base.service");
const Notifications = require("../models/notifications.model");

class NotificationsService extends BaseService {

    static instance;
    constructor() {
        if (NotificationsService.instance) return NotificationsService.instance;
        super(Notifications);
        NotificationsService.instance = this;
    }

    /**
     * @returns { NotificationsService }
     */
    static getInstance() {
        if (!NotificationsService.instance) NotificationsService.instance = new NotificationsService();
        return NotificationsService.instance;
    }

    async createNotifications(data) {
        try {
            const userId = data.idEmpl
            data.userId = userId;
            if (data.types === "LEAVE_REQUEST") {
                data.leaveRequest = {content : data.content};
                data.payment = {
                    totalPayment : 0,
                    hourlyRate : 0,
                    presenceHours : 0,
                    method : "CASH",
                };
                data.status = "SEND";

            } else if(data.types === "PAYMENT"){
                data.payment = {
                    totalPayment : data.totalPayment,
                    hourlyRate : data.hourlyRate,
                    presenceHours : data.presenceHours,
                    method : "BANK_TRANSFERT",
                };
                data.leaveRequest = {content : "empty"};
                data.status = "RESOLVED";
            } else{
                console.log("others notifs");
            }
            const notifications = await super.create(data); 
            return notifications;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async updateNotifications(NotificationsId, data) {
        try {
            const filter = { _id: NotificationsId };
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

    async ChangeStatusNotif(dataObj) {// "PENDING" or "RESOLVED"
        try {
            const filter = { _id: dataObj.id };
            const data = {status : dataObj.status}
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

    async deleteNotifications(data) {
        try {
            const NotificationsId = data.idNotif
            const filter = { _id: NotificationsId };
            const deletes = await super.delete(filter); 
            return deletes;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }


    async findAllNotifsBy(filter, query = {}) {
        try {
            const notifs = await super.find(filter, query); 
            return notifs;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async findOneNotifsBy(filter, query = {}) {
        try {
            const notifs = await super.findOne(filter, query); 
            return notifs;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async findAllNotifs(query = {}) { 
        try {
            const results = await this.findAllNoFilter({}, query);
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

module.exports = NotificationsService.getInstance();
