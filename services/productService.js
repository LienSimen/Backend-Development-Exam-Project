class ProductService {
  constructor(db) {
      this.db = db;
  }

  async createProduct(productData) {
      return await this.db.Product.create(productData);
  }

  async getAllProducts() {
      const sql = `
    SELECT 
      p.productId,
      p.name,
      p.description,
      p.quantity,
      p.price,
      p.discount,
      b.name AS brandName,
      c.name AS categoryName,
      p.imgURL,
      p.isDeleted,
      p.createdAt
    FROM Products AS p
    LEFT JOIN Categories AS c ON p.categoryId = c.id
    LEFT JOIN Brands AS b ON p.brandId = b.id
  `;
      const results = await this.db.sequelize.query(sql, {
          type: this.db.sequelize.QueryTypes.SELECT
      });
      return results;
  }

  async getProductById(productId) {
      return await this.db.Product.findOne({
          where: {
              productId: productId
          }
      });
  }

  async updateProduct(productId, updateData) {
      const product = await this.db.Product.findByPk(productId);
      if (!product) {
          throw new Error('Product not found');
      }
      await this.db.Product.update(updateData, {
          where: {
              productId: productId
          }
      });
  }

  async softDeleteProduct(productId) {
      const product = await this.db.Product.findByPk(productId);
      if (!product) {
          throw new Error('Product not found');
      }
      await this.db.Product.update({
          isDeleted: true
      }, {
          where: {
              productId: productId
          }
      });
  }
}

module.exports = ProductService;