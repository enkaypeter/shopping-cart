import request from "supertest";
import express from 'express';

import { clearDatabase, closeDatabaseConnection, seedProductsTable} from "./utils";
import ProductRepository from "../src/api/repositiories/products";
import CartRepository from "../src/api/repositiories/cart";

const cartRepository    = new CartRepository();
const productRepository = new ProductRepository();

const app = express();
require('../src/loaders').default({ expressApp: app }).then()



describe('DELETE /carts', () => {
  /**
   * Clear database and seed products table with products.
   */
  beforeEach(async (done) => {
    await clearDatabase();
    await seedProductsTable();
    done();
  });
  
  it('should remove an item from cart ', async (done) => {
    let cart = await cartRepository.createDummyCart();
    let products = await productRepository.getAllProducts();

    // correct payload with no errors.
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[4].id,
      quantity: 3,
      sku: products[4].sku,
      price: products[4].price
    };

    // Add product to cart.
    const addToCartResponse = await request(app).post('/api/carts').send(addToCartPayload)
    expect(addToCartResponse.status).toBe(200)
    
    // correct payload with no errors.
    const deleteCartPayload = {
      cart_id: addToCartResponse.body.data.cartId,
      product_id: addToCartResponse.body.data.productId,
    };
    
    // delete cart.
    const response = await request(app).delete('/api/carts').send(deleteCartPayload);
    expect(response.status).toBe(200);

    // get cart item.
    const getCartItemResponse = await cartRepository.getCartItem({productId: addToCartPayload.product_id});
    expect(getCartItemResponse).toBeNull();
    done();
  });

  it('should fail if cart_id does not exist', async (done) => {
    const products = await productRepository.getAllProducts();
    const cart = await cartRepository.createDummyCart();
    
    // correct payload with no errors.
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[4].id,
      quantity: 3,
      sku: products[4].sku,
      price: products[4].price
    };

    // Add product to cart.
    const addToCartResponse = await request(app).post('/api/carts').send(addToCartPayload)
    expect(addToCartResponse.status).toBe(200)
    
    // incorrect payload with incorrect cart id.
    const deleteCartPayload = {
      cart_id: 2005,
      product_id: products[4].id
    };

    // remove cartItem
    const response = await request(app).delete('/api/carts').send(deleteCartPayload);
    expect(response.status).toBe(412);
    done();
  });

  it('should fail if product_id does not exist', async (done) => {
    const cart = await cartRepository.createDummyCart();
    const products = await productRepository.getAllProducts();

    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[4].id,
      quantity: 3,
      sku: products[4].sku,
      price: products[4].price

    };

    // Add product to cart.
    const addToCartResponse = await request(app).post('/api/carts').send(addToCartPayload)
    expect(addToCartResponse.status).toBe(200)
    
    // incorrect payload with incorrect product id.
    const deleteCartPayload = {
      cart_id: cart.id,
      product_id: 2005
    };

    // remove cartItem.
    const response = await request(app).delete('/api/carts').send(deleteCartPayload);
    expect(response.status).toBe(412);
    done();

  })
  afterAll(async (done) => {
    await clearDatabase();
    await closeDatabaseConnection();
    done();
  });
})