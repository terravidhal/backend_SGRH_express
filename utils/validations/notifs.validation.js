const { Joi, Validation, TYPE_NOTIF, STATUS} = require("../../configs/app.config");

const createNotifs = (req, res, next) => {

    return Validation (req.body, {
        employeeName: Joi.string().min(2).max(50),
        content: Joi.string().min(2).max(250),
        userId: Joi.string(),
    }, res, next);
};

const updateStatusNotifs = (req, res, next) => {

    return Validation (req.body, {
        status: Joi.string().valid(...STATUS).uppercase(),
    }, res, next);
};



module.exports = { createNotifs, updateStatusNotifs };
