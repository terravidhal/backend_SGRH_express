const db = require('../configs/database.config');
const UserModel = require("../src/models/user.model");
const { configs } = require('../configs/app.config');
const authService = require('../src/services/auth/auth.service');



async function seedManager() {
    if (configs.use('database')) db.connect(configs.getDatabase());
    
    try {
      const data = {
        last_name: configs.getValue('NAME_MANAGER'),
        first_name: configs.getValue('NAME_MANAGER'),
        username: configs.getValue('NAME_MANAGER'),
        email: configs.getValue('EMAIL_MANAGER'),
        password: configs.getValue('PASSWORD_MANAGER'),
        password_confirm: configs.getValue('PASSWORD_MANAGER'),
        role: configs.getValue('ROLE_MANAGER')
      };
        const findUser = await UserModel.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser) {
          console.log("manager already exists");
          process.exit(1);
        }

        const password = await authService.hash(data.password);
        data.confirmation_token = null;
        data.confirmed_at = new Date();
        data.password = password;

        const user = await authService.create(data);
        if (user.error == true) {
           console.log("Error creating manager user:",user.message);
           process.exit(1);
        } 

    } catch (err) {
      console.error("Error creating manager user:", err);
      process.exit(1); 
    }

    db.disconnect();
  }




seedManager().then(() => {
  console.log("Manager seeding completed");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding manager:", err);
  process.exit(1);
});