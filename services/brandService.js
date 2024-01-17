class BrandService {
  constructor(db) {
      this.Brand = db.Brand;
      this.Product = db.Product;
  }

  async createBrand(brandData) {
      return await this.Brand.create(brandData);
  }

  async getAllBrands() {
      return await this.Brand.findAll({
          include: [{
              model: this.Product
          }]
      });
  }

  async updateBrand(id, brandData) {
      return await this.Brand.update(brandData, {
          where: {
              id
          }
      });
  }

  async deleteBrand(id) {
      const brand = await this.Brand.findOne({
          where: {
              id
          },
          include: [{
              model: this.Product
          }]
      });

      // Check if brand exists
      if (!brand) {
          throw new Error('Brand not found.');
      }

      // Check if brand has products assigned to it
      if (brand.Products && brand.Products.length > 0) {
          throw new Error('Cant delete brand with products assigned to it');
      }

      // Delete if not
      await brand.destroy();
  }
}

module.exports = BrandService;