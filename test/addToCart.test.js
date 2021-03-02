import request from "supertest";
import express from 'express';

import { clearDatabase, closeDatabaseConnection, seedProductsTable} from "./utils"
import ProductRepository from "../src/api/repositiories/products";
import CartRepository from "../src/api/repositiories/cart";
import CartService from "../src/api/services/cart";
import cart from "../src/api/routes/cart";

const app = express();
require('../src/loaders').default({ expressApp: app }).then()

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();


describe('POST /carts', () => {
  beforeEach(async (done) => {
    await clearDatabase();
    await seedProductsTable();
    done();
  });
  
  it('should add a product to cart ', async (done) => {
    let cart = await cartRepository.createDummyCart();
    let products = await productRepository.getAllProducts();


    // correct payload with no errors.
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[0].id,
      quantity: 3,
      sku: products[0].sku,
      price: products[0].price
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('item added to cart successfully')
    expect(response.body.data).not.toBeNull()

    // product should exist in cart.
    const cartItemResponse  = cartRepository.findCartItem({productId: addToCartPayload.product_id});
    expect(cartItemResponse).not.toBeNull()    
    done();
  });

  it('should fail validation if product sku and price is wrong', async (done) => {
    // const cartRepository  =  new CartRepository();
    let cart = await cartRepository.createDummyCart();
    let products = await productRepository.getAllProducts();

    // incorrect payload with incorrect sku and price.
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: products[0].id,
      quantity: 3,
      sku: "BB-AA-WRONG",
      price: 2000.50
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(412)
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors).not.toBeNull()
    done();
  });

  it('should fail validation if quantity requested is more than available inventory', async (done) => {
    let carts = await cartRepository.createDummyCart();
    let products = await productRepository.getAllProducts();


    // incorrect payload with incorrect product quantity.
    const addToCartPayload = {
      cart_id: carts.id,
      product_id: products[0].id,
      quantity: 3000,
      sku: "RD-CNV-43",
      price:  products[0].price
    };

    const response = await request(app).post('/api/carts').send(addToCartPayload)
    expect(response.status).toBe(412)
    expect(response.body.message).toBe('validation failed')
    expect(response.body.data.errors).not.toBeNull()
    done();
  })

  it('should update product inventory', async(done) => {
    const cartService = new CartService();
    const singleProduct = await productRepository.getAllProducts();
    let cart = await cartRepository.createDummyCart();

    // correct payload with no errors.
    const addToCartPayload = {
      cart_id: cart.id,
      product_id: singleProduct[0].id,
      quantity: 3,
      sku: singleProduct[0].sku,
      price: singleProduct[0].price
    };
    
    // add to cart
    const addToCartResponse = await cartService.makeAddToCart(addToCartPayload);
    expect(addToCartResponse).toBeDefined();

    // get an item from cart
    const getCartItemResponse = await cartRepository.getCartItem({productId: addToCartPayload.product_id});
    expect(getCartItemResponse).toBeDefined();


    // verify inventory 
    const singleProductResponse_2 = await productRepository.getById(addToCartPayload.product_id);
    const currentInventory = Math.abs(singleProduct[0].quantity - getCartItemResponse.quantity);
    expect(currentInventory).toBe(singleProductResponse_2.quantity);
    done();
  })

  afterAll(async (done) => {
    await clearDatabase();
    await closeDatabaseConnection();
    done();
  });
})