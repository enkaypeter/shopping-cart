import CartRepository from "../repositiories/cart";

export default class CartService extends CartRepository {
  constructor(){
    super();
  }

  async getCart(){
    const cart = await this.getCarts();

  }

  async getAll() {

  }

  // save()

  async addToCart (cartId = 1, payload) {
    let cart = await this.getCartById(cartId);
    // create a dummy cart if a cart with id = 1 doesn't exist
    cart = cart.length == 0 ? await this.createDummyCart() : cart

    await this.saveToCart()
  }
}