module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'userId'
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      address: DataTypes.TEXT,
      telephoneNumber: DataTypes.STRING,
      membershipStatusId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
  });

  User.associate = function(models) {
      User.belongsTo(models.Role, {
          foreignKey: 'roleId'
      });

      User.belongsTo(models.MembershipStatus, {
          foreignKey: 'membershipStatusId'
      });

      User.hasMany(models.Order, {
          foreignKey: 'userId'
      });
      User.hasMany(models.Cart, {
          foreignKey: 'userId'
      });
  };

  return User;
};