const Controller = require('../controller');
const authService = require('../../services/auth/auth.service');

class AuthController extends Controller {

    static instance;
    constructor() {

      if (AuthController.instance) return AuthController.instance;

      super();
      AuthController.instance = this;
    }

    /**
     * @returns { AuthController }
     */
    static getInstance() {

      if (!AuthController.instance) AuthController.instance = new AuthController();

      return AuthController.instance;
    }

    async register (req, res, next) {
        const response = await authService.register(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'User created successfully', { otp: data.otp, email: data.user.email }, 201);
    };
    
    async activate_account (req, res, next) {
        const data = await authService.activateAccount(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return super.success(res, 'Account successfully activated');
    };
    
    async login (req, res, next) {
        const data = await authService.login(req.body, true);
        if (data.error) return super.failed(res, 'The email and password you entered do not match any accounts on record');
    
        return super.success(res, 'Connection completed successfully', data.data);
    };

    // Add create employee // account active by default
    async createEmployee (req, res, next) {
      const response = await authService.createEmployee(req.body);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'Employee created successfully', data, 201);
    };


    // Add update password
    async updateUser (req, res, next) {
      const userId = req.auth._id 
      const response = await authService.updateUser(userId, req.body);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'password updated successfully', data, 201);
    };

    // Add Update user's imgProfile
    async updateImgProfile (req, res, next) {
      const userId = req.auth._id 
      const response = await authService.updateImgProfile(userId, req.body);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'password imgProfile successfully', data, 201);
    };

    // Add findbByUser
    async findOneUserById (req, res, next) {
      const userId = req.auth._id 
      const filter = { _id: userId };
      const response = await authService.findOneUserBy(filter);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'Tasks by userid', data, 201);
    }

    // Add findbByUser in Table
    async findOneUserByIdInTable (req, res, next) {
      const userId = req.params.id 
      const filter = { _id: userId };
      const response = await authService.findOneUserBy(filter);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'Tasks by userid', data, 201);
    }

    // add findAllUsers Employee
    async findAllUsersEmployee (req, res, next) {
      const filter = { role: 'EMPLOYEE' };
      const response = await authService.findAllUsersBy(filter);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'all employee', data, 201);
    }

    // add delete Employee
    async deleteEmployee (req, res, next) {
      const response = await authService.deleteEmployee(req.body);
      if (response.error) return super.failed(res, response.message);
  
      const data = response.data;
      return super.success(res, 'employee deleted successfully!!', data, 201);
    }
}

module.exports = AuthController.getInstance();
