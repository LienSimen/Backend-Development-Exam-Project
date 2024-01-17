module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
  }, {
      timestamps: false
  });

  Role.associate = function(models) {
      Role.hasMany(models.User, {
          foreignKey: 'roleId'
      });
  };

  return Role;
};