import ProductRepository from "../repositiories/products";
export default class ProductService extends ProductRepository {
  constructor() {
    super();
  }

  async fetchAlProducts() {
    return await this.getAllProducts();
  }
}