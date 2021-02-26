import db from "../../loaders/database";
const { CartItems, Carts, Products } =  db;
export default class CartRepository {
  constructor() {
    this.db = db.sequelize;
  }

  async findAll() {
    const carts =  await Carts.findAll();
    return carts
  }

  async getCarts(){
    const carts = await this.findAll();
    return carts;
  }

  async getCartById(cartId) {
    const carts = await this.findAll({
      where: {
        id: cartId
      },
      raw: true
    });
    
    return carts;
  }

  async saveCartItems(cartId, payload) {
    // const cartItems = await CartItems.create({});
    return {}
  }

  async createDummyCart(){
    const carts = await Carts.create({
      first_name: "john",
      last_name:"doe",
      email: "johndoe@domain.com",
      created_at: new Date()
    });

    return carts;
  }

  async save(){

  }

  async saveToCart() {
    let allCartItems   = await this.save()
    return allCartItems;
  }


}