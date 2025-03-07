const db = require('../configs/database.config');
const UserModel = require("../src/models/user.model");
const { configs } = require('../configs/app.config');
const authService = require('../src/services/auth/auth.service');



async function seedEmployee() {
    if (configs.use('database')) db.connect(configs.getDatabase());
    
    try {
      const data = {
        last_name: configs.getValue('NAME_EMPLOYEE'),
        first_name: configs.getValue('NAME_EMPLOYEE'),
        username: configs.getValue('NAME_EMPLOYEE'),
        email: configs.getValue('EMAIL_EMPLOYEE'),
        password: configs.getValue('PASSWORD_EMPLOYEE'),
        password_confirm: configs.getValue('PASSWORD_EMPLOYEE'),
        role: configs.getValue('ROLE_EMPLOYEE')
      };
        const findUser = await UserModel.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser) {
          console.log("employee already exists");
          process.exit(1);
        }

        const password = await authService.hash(data.password);
        data.confirmation_token = null;
        data.confirmed_at = new Date();
        data.password = password;

        const user = await authService.create(data);
        if (user.error == true) {
           console.log("Error creating employee user:",user.message);
           process.exit(1);
        } 

    } catch (err) {
      console.error("Error creating employee user:", err);
      process.exit(1); 
    }

    db.disconnect();
  }




seedEmployee().then(() => {
  console.log("Employee seeding completed");
  process.exit(0);
}).catch((err) => {
  console.error("Error seeding employee:", err);
  process.exit(1);
});