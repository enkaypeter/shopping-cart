import { query } from "express";
import db from "../../loaders/database";
const { cartItems, carts, products } =  db;
export default class CartRepository {
  constructor() {}

  async findAll() {
    return await carts.findAll();
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
    return await cartItems.destroy({
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

  async findCartItemAsoc(query) {
    const cartItemResponse = await cartItems.findAll({
      attributes: ['id', 'sku', 'price', 'quantity'],
      where: query,
      raw: true,
      include: [carts],
    })

    return cartItemResponse;
  }

  async getCartItemAsoc(payload) {
    return await this.findCartItemAsoc(payload); 
  }

  async getCartItem(payload){
    return await this.findCartItem(payload);
  }
 
  async deleteCartItemById(payload) {
    return await this.deleteById(payload);
  }

  async getCartById(cartId) {
    const carts = await this.findById(cartId)
    const [cart] = carts;
    return cart;
  }

  async saveCartItems(payload) {
    return await cartItems.create(payload)
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

  async saveToCart(payload) {
    return await this.saveCartItems(payload)
  }


}