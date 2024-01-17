class UserService {
  constructor(db) {
      this.User = db.User;
      this.Role = db.Role;
      this.MembershipStatus = db.MembershipStatus;
      this.Op = db.Sequelize.Op;
  }

  async create(userData) {
      try {
          const user = await this.User.create(userData);
          return user;
      } catch (error) {
          throw error;
      }
  }

  async getAllUsers(options) {
      return await this.User.findAll(options);
  }

  async getOneByIdentifier(identifier) {
      try {
          const user = await this.User.findOne({
              where: {
                  // Flexible search condition to allow use of email or username
                  [this.Op.or]: [{
                          username: identifier
                      },
                      {
                          email: identifier
                      }
                  ]
              }
          });
          return user;
      } catch (error) {
          throw error;
      }
  }

  async getUserById(userId) {
      return await this.User.findByPk(userId, {
          include: [this.Role, this.MembershipStatus]
      });
  }

  // Updating user detail including roles and membership status
  async updateUserDetails(userId, userDetails) {
      const user = await this.User.findByPk(userId);
      if (user) {
          await user.update(userDetails);
      } else {
          throw new Error('User not found');
      }
  }
}

module.exports = UserService;