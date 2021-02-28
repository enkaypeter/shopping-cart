import request from "supertest";
import express from 'express';

import { clearDatabase, closeDatabaseConnection, seedProductsTable} from "./utils"
import ProductRepository from "../src/api/repositiories/products";
import CartRepository from "../src/api/repositiories/cart";


/**
 * Clear database and seed products table with products
 */
beforeAll(async (done) => {
  await clearDatabase();
  await seedProductsTable();
  done();
});

/**
 * Clear all test data and close connection after every test.
 */
afterAll(async (done) => {
  await clearDatabase();
  await closeDatabaseConnection();
  done();
})

describe('POST /carts', () => {
  
  it('should add a product to cart ', async (done) => {
    const app = express();
    await require('../src/loaders').default({ expressApp: app });

    // correct payload with no errors.
    const addToCartPayload = {
      product_id: 2,
      quantity: 3,
      sku: "RD-CNV-43",
      price: 250.00
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('item added to cart successfully')
    expect(response.body.data).not.toBeNull()

    // product should exist in cart.
    const cartRepository = new CartRepository();
    const cartItemResponse = cartRepository.findCartItem({productId: addToCartPayload.product_id});
    expect(cartItemResponse).not.toBeNull()    
    done();
  });

  it('should fail validation if product sku and price is wrong', async (done) => {
    const app = express();
    await require('../src/loaders').default({ expressApp: app });

    // incorrect payload with incorrect sku and price.
    const addToCartPayload = {
      product_id: 2,
      quantity: 3,
      sku: "RD-CNV-44",
      price: 300.00
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(412)
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors).not.toBeNull()
    expect(response.body.data.errors.price[0]).toBe('price has changed and is now 250.00')
    expect(response.body.data.errors.sku[0]).toBe('sku is invalid. Please check and try again')
    done();
  });

  it('should fail validation if quantity requested is more than available inventory', async (done) => {
    const app = express();

    await require('../src/loaders').default({ expressApp: app });

    // incorrect payload with incorrect product quantity.
    const addToCartPayload = {
      product_id: 2,
      quantity: 3000,
      sku: "RD-CNV-43",
      price: 250.00
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(412)
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors.quantity[0]).toBe('quantity requested is more than available inventory of 22')
    expect(response.body.data.errors).not.toBeNull()
    done();
  })

  it('should update product inventory', async(done) => {
    // correct payload with no errors.
    const addToCartPayload = {
      product_id: 2,
      quantity: 3,
      sku: "RD-CNV-43",
      price: 250.00
    };

    const productRepository = new ProductRepository();
    const productResponse = await productRepository.getById(addToCartPayload.product_id);

    // product quantity should be 22 after adding quantity of 3 to cart.
    expect(productResponse.quantity).toBe(22)
    expect(productResponse).not.toBeNull();
    done();
  })
})