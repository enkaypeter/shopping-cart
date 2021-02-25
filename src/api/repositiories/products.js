import db from "../../loaders/database";
const { Products } =  db;
export default class ProductRepository {
  constructor() {
    this.db = db.sequelize;
  }


  async getById(productId) {
    const singleProducts = await Products.findAll({
      where: {
        id: productId
      },
      raw: true
    });

    const [singleProduct] = singleProducts;
    return singleProduct;
  }

  static async findAll() {
    const products =  await Products.findAll()
    return products;
  }

  async getAllProducts() {
    let allProducts   = await ProductRepository.findAll()
    return allProducts;
  }

}