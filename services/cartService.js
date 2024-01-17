const { generateOrderNumber } = require('../utils/cryptoUtils');

class CartService {
    constructor(db) {
        this.db = db;
    }

    async getCartByUserId(userId) {
        return this.db.Cart.findOne({
            where: {
                userId
            },
            include: [{
                model: this.db.CartItem,
                // Only include cart items that isnt soft-deleted
                where: {
                    isDeleted: false
                },
                // Return cart even if there are no cart items
                required: false
            }]
        });
    }
    // Updates the users membership status based on order history
    async updateMemberStatus(userId, transaction) {
        const user = await this.db.User.findByPk(userId, {
            // Transaction is passed from the checkout to ensure all operations are performed or none if an error occurs
            transaction
        });
        // Getting total number of items purchased by the user across all the orders
        const orders = await this.db.Order.findAll({
            where: {
                userId: userId
            },
            include: [{
                model: this.db.OrderItem
            }],
            transaction
        });
        let totalPurchase = orders.reduce((total, order) => {
            // Summing up quantity of all items in each order
            const orderItems = order.OrderItems.reduce((sum, item) => sum + item.Quantity, 0);
            return total + orderItems;
        }, 0);

        // Determine if membership status should change based on items purchased
        let newStatusId = user.membershipStatusId;
        if (totalPurchase >= 30) {
            // If 30 or more items purchased, upgrade to Gold
            const goldStatus = await this.db.MembershipStatus.findOne({
                where: {
                    statusName: 'Gold'
                },
                transaction
            });
            // Assign gold status if it exists, if not, keep the current status
            newStatusId = goldStatus ? goldStatus.membershipStatusId : user.membershipStatusId;
        } else if (totalPurchase >= 15) {
            // If 15 to 29 items purchased, upgrade to Silver
            const silverStatus = await this.db.MembershipStatus.findOne({
                where: {
                    statusName: 'Silver'
                },
                transaction
            });
            // Assign silver status if it exists, if not, keep the current status
            newStatusId = silverStatus ? silverStatus.membershipStatusId : user.membershipStatusId;
        }

        // Updating users membership if it has changed
        if (newStatusId !== user.membershipStatusId) {
            user.membershipStatusId = newStatusId;
            await user.save({
                transaction
            });
        }
    }
    // Adds a product to the cart or updates quantity if it already exists
    async addToCart(userId, productId, quantity) {
        // Getting product by its primary key
        const product = await this.db.Product.findByPk(productId);
        // Checking if product exists, that it is enough in stock and not soft-deleted
        if (!product || product.quantity < quantity || product.isDeleted) {
            const error = new Error('Product is out of stock or does not exist.');
            error.statusCode = 404;
            throw error;
        }
        // Getting the users cart
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            // Create one if it doesn't exist
            cart = await this.db.Cart.create({
                userId
            });
        }

        // Checking for cart item that isnt soft-deleted
        const existingCartItem = await this.db.CartItem.findOne({
            where: {
                cartId: cart.id,
                productId,
                isDeleted: false
            }
        });
        // If item is already in cart, update quantity
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
        } else {
            // If not, create a new cart item
            await this.db.CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                unitPrice: product.price
            });
        }
        // Return updated cart
        return this.getCartByUserId(userId);
    }
    // Updates the quantity of a cart item of a specific user
    async updateCartItem(cartId, cartItemId, quantity) {
        // Finding the cart item by its ID and ensure it belongs to the correct cart and isnt soft-deleted
        const cartItem = await this.db.CartItem.findOne({
            where: {
                id: cartItemId,
                cartId: cartId,
                isDeleted: false
            }
        });
        // If it doesnt exist, throw error
        if (!cartItem) {
            throw new Error('Cart item not found');
        }
        // Update quantity of the cart item
        cartItem.quantity = quantity;
        await cartItem.save();
        // Return updated cart item
        return cartItem;
    }

    // Soft-deletes a cart item
    async softDeleteCartItem(cartItemId) {
        // Getting cart item by its primary key
        const cartItem = await this.db.CartItem.findByPk(cartItemId);
        // If it doesnt exist, throw error
        if (!cartItem) {
            throw new Error('Cart item not found');
        }
        // Soft-delete the cart item
        cartItem.isDeleted = true;
        // Save the cart item
        await cartItem.save();
        // Return success message
        return {
            message: 'Cart item removed'
        };
    }
    
    // User checkout. Creating order, applying discount and updating membership status
    async checkout(userId) {
        // Using transaction to ensure all operations are performed or none if an error occurs
        const transaction = await this.db.sequelize.transaction();
        try {
            // Get the users cart
            const cart = await this.getCartByUserId(userId);
            // Check if cart is empty or doesnt exist
            if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
                throw new Error('Cart is empty or does not exist');
            }
            // Fetch user
            const user = await this.db.User.findByPk(userId, {
                transaction
            });
            if (!user) {
                throw new Error('User not found');
            }

            // Get users membership status to apply discount if needed
            const membershipStatus = await this.db.MembershipStatus.findByPk(user.membershipStatusId, {
                transaction
            });
            if (!membershipStatus) {
                throw new Error('Could not find membership status');
            }
            const discount = membershipStatus.discount;

            // Create an order
            const orderNumber = generateOrderNumber();
            const order = await this.db.Order.create({
                userId: userId,
                OrderStatus: 'In Progress',
                TotalPrice: 0, // Setting this to 0, calculating below
                OrderNumber: orderNumber
            }, {
                transaction
            });

            // Calc total price + discount and creating order items
            let totalPrice = 0;
            for (const item of cart.CartItems) {
                const product = await this.db.Product.findByPk(item.productId, {
                    transaction
                });
                if (product.quantity < item.quantity) {
                    throw new Error(`Product ${product.name} is out of stock`);
                }
            
                // Apply product discount (in percentage)
                let discountedPrice = item.unitPrice * (1 - (product.discount / 100));
            
                // Apply membership discount (in percentage)
                const itemTotalPrice = item.quantity * (discountedPrice * (1 - (discount / 100)));
                totalPrice += itemTotalPrice;
            
                // Create OrderItem for each cart item
                await this.db.OrderItem.create({
                    orderId: order.orderId,
                    productId: item.productId,
                    Quantity: item.quantity,
                    UnitPrice: discountedPrice * (1 - (discount / 100)),
                }, {
                    transaction
                });
            }

            // Update total price of the order after all items have been added
            order.totalPrice = totalPrice;
            await order.save({
                transaction
            });

            // Update membership status if needed
            await this.updateMemberStatus(userId, transaction);

            // Marking cart items as soft-deleted after transaction is successful, so the user can continue shopping
            await this.db.CartItem.update({
                isDeleted: true
            }, {
                where: {
                    cartId: cart.id,
                    isDeleted: false
                },
                transaction
            });

            // Commiting transaction if everything went as it should
            await transaction.commit();
            return {
                message: 'Checkout successful.',
                OrderId: order.id
            };

            // Rolling back transaction if something went wrong
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = CartService;