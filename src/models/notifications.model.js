const { BaseSchema, STATUS, TYPE_NOTIF, mongoose, HOURLY_RATE,  TYPE_PAYMENT, } 
= require("../../configs/app.config");
  
const schema = {
    types: {
        type: String,
        enum: TYPE_NOTIF,
        default: TYPE_NOTIF[0],
        required: false,
    },
    employeeName: {
        type: String,
        required: true,
        default: null,
    },
    leaveRequest: {
        type: {
            content: {
                type: String,
                required: true,
                default: null,
            },
        },
        required: true
    },
    payment: {
        type: {
            totalPayment: { 
                type: Number ,
                required: true,
            },
            hourlyRate: { 
                type: Number ,
                required: false,
                default: HOURLY_RATE[0],
            },
            presenceHours: { 
                type: Number ,
                required: false,
            },
            method: {
                type: String,
                enum: TYPE_PAYMENT,
                default: TYPE_PAYMENT[0],
                required: false,
            },
        },
        required: true
    },
   /* content: {
        type: String,
        required: true,
        default: null,
    },*/
    status: {
        type: String,
        enum: STATUS,
        default: STATUS[2],
        required: false,
    },
    userId: { // one to many (userId users create notifs => employee, admin or managers)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
};

const Notifications = BaseSchema('notifications', schema);

module.exports = Notifications;
