class CategoryService {
  constructor(db) {
      this.Category = db.Category;
      this.Product = db.Product;
  }

  async createCategory(categoryData) {
      return await this.Category.create(categoryData);
  }

  async getAllCategories() {
      return await this.Category.findAll({
          include: [{
              model: this.Product
          }]
      });
  }

  async updateCategory(categoryId, categoryData) {
      return await this.Category.update(categoryData, {
          where: {
              id: categoryId
          }
      });
  }

  async deleteCategory(categoryId) {
      const category = await this.Category.findOne({
          where: {
              id: categoryId
          },
          include: [{
              model: this.Product
          }]
      });

      // Check if category exists
      if (!category) {
          throw new Error('Category not found.');
      }
      // Check if category has products assigned to it
      if (category && category.Products.length > 0) {
          throw new Error('Cant delete category with products assigned to it');
      }

      // Delete if not
      await category.destroy();
  }
}

module.exports = CategoryService;