const BaseService = require("../base.service");
const User = require("../../models/user.model");

class AuthService extends BaseService {

    constructor() {

        super(User);
    }

    generateOTP(token = { type: 'numeric', length: 6 }) {
        const keys = {
            numeric: '0123456789',
            alphabet: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN'
        };

        const database = keys[token.type] ?? keys.alphabet;
        let result = '';
        for (let i = 0; i < token.length; i++) {

            result += database.charAt(Math.floor(Math.random() * database.length));
        }

        return result;
    }

    async login(data, active = false) {

        let find_user = await super.findOne({ email: new RegExp(data.email, 'i') }, { select: 'last_name, first_name, username, email, password, role, confirmed_at, loginHistory' });
        if (find_user.error || !find_user.data) return { error: true, message: 'This account not found' };

        const user = find_user.data;

        const verify_password = await this.hashCompare(data.password, user.password); 
        if (!verify_password) return { error: true, message: 'Password does not match' };

        if (active && !user.confirmed_at) return { error: true, message: 'Account is not yet activated' }

        // add save connexion log
        if (!user.loginHistory) {
            user.loginHistory = [];
        }
        user.loginHistory.push(
            {
                times: new Date(),
                dates : new Date()
            }
        );
        user.save();

        const token = super.token({ id: user._id});  // payload : { id: user._id}
        return {
            error: false,
            data: {
                token,
                user: {
                    id: user._id,
                    last_name: user.last_name,
                    first_name: user.first_name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        };
    }

    async register(data, token = { type: 'numeric', length: 6 }) {
        const findUser = await super.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser.error || findUser.data) return { error: true, message: 'This email is already in use' };

        const password = await super.hash(data.password);
        const confirmation_token = this.generateOTP(token);

        data.confirmation_token = confirmation_token;
        data.password = password;
        const user = await this.create(data);
        if (user.error) return user;

        return {
            error: false,
            data: { otp: confirmation_token, user: user.data }
        };
    }

    async activateAccount(data) {
        const response = { error: true, message: 'This account not found' };
        const where = { email: new RegExp(data.email, 'i'), confirmation_token: data.code };
        const find_user = await super.findOne(where);
        if (find_user.error || !find_user.data) return response;

        const update = await super.update(where, {
            confirmation_token: null,
            confirmed_at: new Date()
        });

        response.message = 'An error occurred, please try again later !!!';
        return update.error ? response : { error: false };
    }

    // Add create employee // account active by default
    async createEmployee(data) {
        try {
            const findUser = await super.findOne({ email: new RegExp(data.email, 'i')});
            if (findUser.error || findUser.data) return { error: true, message: 'This email is already in use' };
    
            data.first_name = data.username;
            data.last_name = data.username;
            data.username = data.username;
            data.role = "EMPLOYEE";
            const password = await super.hash(data.password);
            data.confirmation_token = null;
            data.confirmed_at = new Date();
            data.password = password;
    
            const user = await super.create(data);
            return user;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }
    // Add update password
    async updateUser(userId, data) {
        try {
             // Check if previousPassword 
            const findUser = await super.findOne({ _id: userId});

            const isPreviousPasswordValid = await this.hashCompare(
                data.currentPassword,
                findUser.data.password
            );
            if (!isPreviousPasswordValid) {
                return { error: true, message: "current password is incorrect !" };
            }
            if (data.password === data.currentPassword) {
                return { error: true, message:"the new password must be different from the old one !" };
            }

            if (data.password) {
                const passwordHash = await super.hash(data.password);
                data.password = passwordHash;
            }
            const filter = { _id: userId };
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

    // Update user's imgProfile
    async updateImgProfile(userId, data) {
        try {
            const filter = { _id: userId };
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

    // Add findOneUser
    async findOneUserBy(filter, query = {}) {
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

    // add find All user Employee
    async findAllUsersBy(filter, query = {}) {
        try {
            const users = await super.find(filter, query); 
            return users;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    // add delete user Employee
    async deleteEmployee(data) {
        try {
            const EmployeeId = data.idEmploy
            console.log("-----------upo",EmployeeId);
            const filter = { _id: EmployeeId };
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
}

module.exports = new AuthService();
