module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        cartId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        unitPrice: DataTypes.DECIMAL(10, 2),
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });

    CartItem.associate = function(models) {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cartId'
        });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'productId'
        });
    };

    return CartItem;
};