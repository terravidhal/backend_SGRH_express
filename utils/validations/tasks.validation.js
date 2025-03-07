const { Joi, Validation, STATUS} = require("../../configs/app.config");

const createTasks = (req, res, next) => {

    return Validation (req.body, {
        name: Joi.string().min(2).max(50),
        description: Joi.string().min(2).max(250),
        status: Joi.string().valid(...STATUS).uppercase(),
        userId: Joi.string(),
    }, res, next);
};



module.exports = { createTasks };
