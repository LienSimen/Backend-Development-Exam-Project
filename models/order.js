module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
      orderId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'orderId'
      },
      userId: DataTypes.INTEGER,
      orderStatus: {
          type: DataTypes.STRING,
          defaultValue: 'In Progress'
      },
      totalPrice: DataTypes.DECIMAL(10, 2),
      OrderNumber: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
      },
  });

  Order.associate = function(models) {
      Order.belongsTo(models.User, {
          foreignKey: 'userId'
      });
      Order.hasMany(models.OrderItem, {
          foreignKey: 'orderId'
      });
  };

  return Order;
};