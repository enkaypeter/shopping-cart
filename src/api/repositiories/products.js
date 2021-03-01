import db from "../../loaders/database";
const { products } =  db;
export default class ProductRepository {
  constructor() {}


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


  async getProductById(productId) {
    let allProducts   = await this.findAll();
    const singleProducts = await this.getById(productId);
    return singleProducts;
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

  async findAll() {
    const allProducts =  await products.findAll()
    return allProducts;
  }

  async updateProductInventory(productId, saveProductPayload) {
    let updateResponse = await this.updateById(productId, saveProductPayload);
    return updateResponse;
  }

  async getAllProducts() {
    let allProducts   = await this.findAll()
    return allProducts;
  }

}