const readline = require('readline');
const bcrypt = require('bcrypt');
const db = require('./models');
const Admin = db.admin;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const creatingAdmin = async () => {
  rl.question('Enter your name: ', async (name) => {
    rl.question('Enter your email: ', async (email) => {
      rl.question('Enter your password should be 6 Character or more.', async (password) => {
        rl.close();

        if (password.length < 6) {
          console.log('Password should be 6 characters or more.');
          creatingAdmin(); // Prompt user again for password
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          try {
            const admin = await Admin.create({
              name: name,
              email: email,
              password: hashedPassword
            });
            console.log('Admin created:', admin);
          } catch (error) {
            console.error('Error creating admin:', error);
          }
        }
      });
    });
  });
};

creatingAdmin();
