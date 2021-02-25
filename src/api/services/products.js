import ProductRepository from "../repositiories/products";
export default class ProductService extends ProductRepository {
  constructor() {
    super();
  }

  async fetchAlProducts() {
    const allProducts = await this.getAllProducts();
    return allProducts;
  }
}