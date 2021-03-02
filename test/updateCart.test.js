import request from "supertest";
import express from 'express';

import { clearDatabase, closeDatabaseConnection, seedProductsTable} from "./utils";
import ProductRepository from "../src/api/repositiories/products";
import CartRepository from "../src/api/repositiories/cart";

const cartRepository    = new CartRepository();
const productRepository = new ProductRepository();

const app = express();
require('../src/loaders').default({ expressApp: app }).then()



describe('PATCH /carts', () => {
  /**
   * Clear database and seed products table with products
   */
  beforeEach(async (done) => {
    await clearDatabase();
    await seedProductsTable();
    done();
  });
  
  it('should update product in cart ', async (done) => {
    let cart = await cartRepository.createDummyCart();
    let products = await productRepository.getAllProducts();


    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[3].id,
      quantity: 3,
      sku: products[3].sku,
      price: products[3].price
    };

    // Add product to cart
    const addToCartResponse = await request(app).post('/api/carts').send(addToCartPayload)
    expect(addToCartResponse.status).toBe(200)
    
    // correct payload with no errors.
    const updateCartPayload = {
      cart_id: addToCartResponse.body.data.cartId,
      product_id: addToCartResponse.body.data.productId,
      quantity: 5
    };
    
    // update cart
    const response = await request(app).patch('/api/carts').send(updateCartPayload);
    expect(response.status).toBe(200);

    // get cart item
    const getCartItemResponse = await cartRepository.getCartItem({productId: updateCartPayload.product_id});
    expect(getCartItemResponse).toBeDefined();


    // verify inventory 
    const singleProductResponse_2 = await productRepository.getById(updateCartPayload.product_id);
    const currentInventory = Math.abs(products[3].quantity - getCartItemResponse.quantity);
    expect(currentInventory).toBe(singleProductResponse_2.quantity);
    done();
  });

  it('should fail if product does not exists', async (done) => {
    let cart  = await cartRepository.createDummyCart();

    // incorrect payload with incorrect product_id
    const updateCartPayload = {
      cart_id: cart.id,
      product_id: 1001,
      quantity: 4
    };

    const response = await request(app).patch('/api/carts').send(updateCartPayload);
    expect(response.status).toBe(412);
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors.product_id).toEqual(['product_id does not exists.'])
    done();
  });

  it('should fail if quantity is more than available inventory', async(done) => {
    let products = await productRepository.getAllProducts();

    // incorrect payload with incorrect quantity and cart_id
    const updateCartPayload = {
      cart_id: 2000,
      product_id: products[3].id,
      quantity: 2000
    };

    const response = await request(app).patch('/api/carts').send(updateCartPayload);
    console.log(response.body.message);

    expect(response.status).toBe(412);
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors.cart_id).toContain('cart_id does not exists.');
    expect(response.body.data.errors.quantity).toContain('quantity requested is more than available inventory of 25.');
    done();
  })
  afterAll(async (done) => {
    await clearDatabase();
    await closeDatabaseConnection();
    done();
  });
})