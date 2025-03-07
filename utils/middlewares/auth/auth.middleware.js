const { response } = require("../../../configs/app.config");
const authService = require("../../../src/services/auth/auth.service");

const getUser = async (req) => {

   // const auth = req.header('Authorization'); // no works
    const auth = req.headers['authorization']; // works in postman , no works in swagger
    if (!auth) return { error: true, message: 'Authorization key not found' };


    const verified = authService.tokenVerify(auth);
    if (!verified) return { error: true, message: 'Incorrect token' };
    
    const user = await authService.findOne({ _id: verified.id }, { select: '_id, last_name, first_name,username, email, role' });
    if (user.error || !user.data) return { error: true, message: 'User not found' };

    return { error: false, data: user.data };
};

const loginUser =  async (req, res, next) => {
    const user = await getUser(req);
    if (user.error) return response.forbidden(res, next);
    req.auth = user.data;
    next();
}

const loginAdmin =  async (req, res, next) => {

    const user = await getUser(req);
    if (user.error) return response.forbidden(res, next);

    if (user.data.role != 'ADMIN') return response.forbidden(res, next, 'You are only authorized to access the content');

    req.auth = user.data;
    next();
}


// Add permission "MANAGER OR ADMIN"
const loginAdminManager =  async (req, res, next) => { 

    const user = await getUser(req);
    if (user.error) return response.forbidden(res, next);

    if (!['ADMIN', 'MANAGER'].includes(user.data.role)) return response.forbidden(res, next, 'You are only authorized to access the content');

    req.auth = user.data;
    next();
}

module.exports = { loginUser, loginAdmin, loginAdminManager };
