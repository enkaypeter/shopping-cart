import db from "../../loaders/database";
const { cartItems, carts } =  db;
export default class CartRepository {
  constructor() {}

  async findAll() {
    const allCarts =  await carts.findAll();
    return allCarts
  }

  async findById(cartId) {
    const cart = await carts.findAll({
      where: {
        id: cartId
      },
      raw: true
    });
    return cart;
  }

  async deleteById(query){
    await cartItems.destroy({
      where: query
    });
  }

  async updateById(payload, query){
    const updatedCartItem = await cartItems.update(payload, {
      where: query,
    })

    const [cartItemResponse] = updatedCartItem

    return cartItemResponse;
  }

  async updateCartItem(payload, query){
    const updateCartResponse = await this.updateById(payload, query);
    return updateCartResponse;
  }

  async findCartItem(query){
    const cartItem = await cartItems.findOne({
      where: query,
      raw: true
    })

    return cartItem;
  }

  async getCartItem(payload){
    const carts = await this.findCartItem(payload);
    return carts;
  }

  async deleteCartItemById(payload) {
    await this.deleteById(payload);
  }

  async getCartById(cartId) {
    const carts = await this.findById(cartId)
    const [cart] = carts;
    return cart;
  }

  async saveCartItems(payload) {
    const allCartItems = await cartItems.create(payload)
    return allCartItems;
  }

  async createDummyCart(){
    const cart = await carts.create({
      first_name: "john",
      last_name:"doe",
      email: "johndoe@domain.com",
      created_at: new Date()
    });

    return cart;
  }

  async save(){

  }

  async saveToCart(payload) {
    let allCartItems   = await this.saveCartItems(payload)
    return allCartItems;
  }


}