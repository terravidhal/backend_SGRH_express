const { BaseSchema, STATUS, mongoose  } = require("../../configs/app.config");
  
const schema = {
    name: {
        type: String,
        required: true,
        default: null,
    },
    description: {
        type: String,
        required: false,
        default: null,
    },
    status: {
        type: String,
        enum: STATUS,
        default: STATUS[0],
        required: false,
    },
    userId: { // one to many (userId specific employee )
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
};

const Tasks = BaseSchema('tasks', schema);

module.exports = Tasks;
