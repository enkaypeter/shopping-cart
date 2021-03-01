import request from "supertest";
import express from 'express';

import { clearDatabase, closeDatabaseConnection, seedProductsTable, seedCartItem} from "./utils";
import ProductRepository from "../src/api/repositiories/products";
import CartRepository from "../src/api/repositiories/cart";
import CartService from "../src/api/services/cart";

const prodRepo = new ProductRepository();

const app = express();
require('../src/loaders').default({ expressApp: app }).then()



describe('PATCH /carts', () => {
  /**
   * Clear database and seed products table with products
   */
  beforeAll(async (done) => {
    console.log('update to cart running...')

    await clearDatabase();
    // let products = await prodRepo.getAllProducts();
    // console.log(products.length);

    await seedProductsTable();
    // let products_sec = await prodRepo.getAllProducts();

    // console.log(products_sec.length);

    // await seedCartItem();
    done();
  });

  it('should ', async () => {
    expect(1).toBe(1)
  })
  
  test('should update product in cart ', async (done) => {

    const cartRepo =  new CartRepository();
    // const cartService = new CartService(prodRepo);
    // let products = await prodRepo.getAllProducts();
    let cart = await cartRepo.createDummyCart();
    let products = await prodRepo.getAllProducts();


    
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[0].id,
      quantity: 3,
      sku: products[0].sku,
      price: products[0].price
    };

    const addToCartResponse = await request(app).post('/api/carts').send(addToCartPayload)
    expect(addToCartResponse.status).toBe(200)

    // const addToCartResponse = await cartService.addToCart(addToCartPayload);
    
    // correct payload with no errors.
    const updateCartPayload = {
      cart_id: addToCartResponse.body.data.cartId,
      product_id: addToCartResponse.body.data.productId,
      quantity: 3,
      sku: addToCartResponse.body.data.sku,
      price: addToCartResponse.body.data.price
    };


    const response = await request(app).patch('/api/carts').send(updateCartPayload);
    expect(response.status).toBe(200);
    done();
  });
})