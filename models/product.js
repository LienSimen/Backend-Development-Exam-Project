module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
      productId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2),
      discount: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      brandId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      imgURL: DataTypes.STRING,
      isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
      }
  });

  Product.associate = function(models) {
      Product.belongsTo(models.Brand, {
          foreignKey: 'brandId'
      });
      Product.belongsTo(models.Category, {
          foreignKey: 'categoryId'
      });
      Product.hasMany(models.CartItem, {
          foreignKey: 'productId'
      });
      Product.hasMany(models.OrderItem, {
          foreignKey: 'productId'
      });
  };

  return Product;
};