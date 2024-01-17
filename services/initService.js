const { hashPassword, generateSalt } = require('../utils/cryptoUtils');
const UserService = require('../services/userService');

// Using axios to fetch the data from the api
const axios = require('axios');

class InitService {
  constructor(models) {
      this.models = models;
      this.userService = new UserService(models);
  }

  async initializeDatabase() {
      try {
          let changesMade = false;
          // Check for roles and create if they don't exist
          const rolesCount = await this.models.Role.count();
          if (rolesCount === 0) {
              await this.models.Role.bulkCreate([{
                      name: 'Admin'
                  },
                  {
                      name: 'User'
                  }
              ]);
              changesMade = true;
          }

          // Check for membership statuses and create if they don't exist
          const membershipsCount = await this.models.MembershipStatus.count();
          if (membershipsCount === 0) {
              await this.models.MembershipStatus.bulkCreate([{
                      statusName: 'Bronze',
                      discount: 0
                  },
                  {
                      statusName: 'Silver',
                      discount: 15
                  },
                  {
                      statusName: 'Gold',
                      discount: 30
                  }
              ]);
              changesMade = true;
          }

          // Create admin user if it doesn't exist
          const adminExist = await this.models.User.findOne({
              where: {
                  username: 'Admin'
              }
          });
          if (!adminExist) {
              const salt = generateSalt();
              const hashedPassword = await hashPassword('P@ssword2023', salt);
              const adminData = {
                  username: 'Admin',
                  email: 'admin@noroff.no',
                  password: hashedPassword,
                  firstName: 'Admin',
                  lastName: 'Support',
                  address: 'Online',
                  telephoneNumber: '911',
                  salt: salt,
                  roleId: 1,
                  membershipStatusId: 1
              };
              await this.userService.create(adminData);
              changesMade = true;
          }
          if (changesMade) {
              return {
                  message: 'Database initialized.',
                  changesMade
              };
          } else {
              return {
                  message: 'Database already initialized.',
                  changesMade
              };
          }
      } catch (error) {
          throw new Error('Database initialization failed: ' + error.message);
      }
  }

  async initializeProducts() {
      try {
          // Check if products already exist in the database
          const productsCount = await this.models.Product.count();
          if (productsCount > 0) {
              return {
                  message: 'Products already initialized.',
                  changesMade: false
              };
          }

          // Fetch the product data from the API
          const response = await axios.get('http://backend.restapi.co.za/items/products');
          const productsData = response.data.data;

          for (const item of productsData) {
              // Check if brands exists and create if not
              const [brand] = await this.models.Brand.findOrCreate({
                  where: {
                      name: item.brand
                  }
              });

              // Check if categories exists and create if not
              const [category] = await this.models.Category.findOrCreate({
                  where: {
                      name: item.category
                  }
              });

              // Creating products with references to brand and category
              await this.models.Product.create({
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  quantity: item.quantity,
                  imgURL: item.imgurl,
                  createdAt: new Date(item.date_added),
                  brandId: brand.id,
                  categoryId: category.id,
                  isDeleted: false
              });
          }

          return {
              message: 'Products initialized.',
              changesMade: true
          };
      } catch (error) {
          throw new Error('Product initialization failed: ' + error.message);
      }
  }
}

module.exports = InitService;