const db = require('../configs/database.config');
const UserModel = require("../src/models/user.model");
const { configs } = require('../configs/app.config');
const authService = require('../src/services/auth/auth.service');



async function seedAdmin() {
    if (configs.use('database')) db.connect(configs.getDatabase());
    
    try {
        const data = {
          last_name: configs.getValue('NAME_ADMIN'),
          first_name: configs.getValue('NAME_ADMIN'),
          username: configs.getValue('NAME_ADMIN'),
          email: configs.getValue('EMAIL_ADMIN'),
          password: configs.getValue('PASSWORD_ADMIN'),
          password_confirm: configs.getValue('PASSWORD_ADMIN'),
          role: configs.getValue('ROLE_ADMIN'),
        };

        const findUser = await UserModel.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser) {
          console.log("admin already exists");
          process.exit(1);
        }
        const password = await authService.hash(data.password);

        data.confirmation_token = null;
        data.confirmed_at = new Date();
        data.password = password;

        const user = await authService.create(data);
        if (user.error == true) {
           console.log("Error creating admin user:",user.message);
           process.exit(1);
        } 

    } catch (err) {
      console.error("Error creating admin user:", err);
      process.exit(1); 
    }

    db.disconnect();
  }




seedAdmin().then(() => {
  console.log("Admin seeding completed");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});