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
    return await this.getById(productId);
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
    return await this.updateById(productId, saveProductPayload);
  }

  async getAllProducts() {
    let allProducts   = await this.findAll()
    return allProducts;
  }

}