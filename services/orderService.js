class OrderService {
    constructor(db) {
        this.db = db;
    }

    async getAllOrders() {
        return this.db.Order.findAll({
            include: [{
                model: this.db.OrderItem
            }]
        });
    }

    async getOrdersByUserId(userId) {
        // Prepare the query options
        const queryOptions = {
            where: {
                userId
            },
            include: [{
                model: this.db.OrderItem     
            }]
        };
        // Perform the query with the prepared options
        return this.db.Order.findAll(queryOptions);
    }

    async updateOrderStatus(orderId, status) {
        const order = await this.db.Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found.');
        }

        order.orderStatus = status;
        await order.save();

        return order;
    }
}

module.exports = OrderService;