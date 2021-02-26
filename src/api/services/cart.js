import CartRepository from "../repositiories/cart";
import ProductRepository from "../repositiories/products";

const productsRepository = new ProductRepository();

export default class CartService extends CartRepository {
  constructor(){
    super();
    this.response = {}
  }

  async addToCart (cartItemData) {
    let newProductQuantity;
    let cart = await this.getCartById(1);
    const productId = cartItemData.product_id;
    
    // create a dummy cart if a cart with id = 1 doesn't exist
    let cartResponse = cart == undefined ? await this.createDummyCart() : cart
    const cartId = cartResponse.id;
    const singleProduct = await productsRepository.getById(cartItemData.product_id);
    if(singleProduct.quantity < cartItemData.quantity) {
      throw new Error ("quantity requested is more than inventory available.")
    };

    // check if the product already exists in cart
    let getcartItemResponse = await this.getCartItem({productId: productId});
    if(getcartItemResponse !== null) {
      const incomingQuantity = cartItemData.quantity;
      const existingQuantity = getcartItemResponse.quantity;
      if(incomingQuantity < existingQuantity) {
        newProductQuantity = singleProduct.quantity + Math.abs(existingQuantity - incomingQuantity)
      } else if (incomingQuantity > existingQuantity) {
        newProductQuantity = singleProduct.quantity - Math.abs(existingQuantity - incomingQuantity)
      } else { // if incomingQuantity and existingQuantity is the same return cartItemData
        return cartItemData; // no action is being performed because it's a duplicate request
      }
    } else {
      newProductQuantity = singleProduct.quantity - cartItemData.quantity;
    };

    let deductProductPayload = {
      productId: singleProduct.product_id,
      quantity: newProductQuantity
    }
    if(newProductQuantity == 10) {
      deductProductPayload.stock_level = 'running_low'
    } else if (newProductQuantity == 0) {
      deductProductPayload.stock_level = 'out_of_stock'
    }

    
    try {
      // update product inventory
      await productsRepository.updateProductInventory(productId, deductProductPayload);
      
      // create cartItems
      const { price, sku, quantity } = cartItemData;
      let saveCartItemPayload = {
        cartId: cartId,
        productId: productId,
        price,
        sku,
        quantity,
        created_at: new Date()
      };

      let saveCartItemsResponse = getcartItemResponse !== null ? 
        await this.updateCartItem(saveCartItemPayload, {productId: productId}) :
      await this.saveToCart(saveCartItemPayload)

      return saveCartItemsResponse
    } catch (error) {
      console.error(error);
      throw new Error(error);      
    }

  }

  async makeUpdateCart(cartItemData){
    let cart = await this.getCartById(1);

    return cart;
    // get product object


    // perform update logic

    //return response


  }
}