module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
      orderItemId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      Quantity: DataTypes.INTEGER,
      UnitPrice: DataTypes.DECIMAL(10, 2),
  });

  OrderItem.associate = function(models) {
      OrderItem.belongsTo(models.Order, {
          foreignKey: 'orderId'
      });
      OrderItem.belongsTo(models.Product, {
          foreignKey: 'productId'
      });
  };

  return OrderItem;
};