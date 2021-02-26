import db from "../../loaders/database";
const { products } =  db;
export default class ProductRepository {
  constructor() {
    this.db = db.sequelize;
  }


  async getById(productId) {
    const singleProducts = await products.findAll({
      where: {
        id: productId
      },
      raw: true
    });

    const [singleProduct] = singleProducts;
    return singleProduct;
  }

  async updateById(productId, payload) {
    const updatedProduct = await products.update(payload, {
      where: {
        id: productId
      },
      raw: true
    })

    const [updatedProductResponse] = updatedProduct;
    return updatedProductResponse;
  }

  static async findAll() {
    const allProducts =  await products.findAll()
    return allProducts;
  }

  async updateProductInventory(productId, saveProductPayload) {
    let updateResponse = await this.updateById(productId, saveProductPayload);
    return updateResponse;
  }

  async getAllProducts() {
    let allProducts   = await ProductRepository.findAll()
    return allProducts;
  }

}