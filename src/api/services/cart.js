import CartRepository from "../repositiories/cart";
import ProductRepository from "../repositiories/products";

const productsRepository = new ProductRepository();

export default class CartService extends CartRepository {
  constructor(){
    super();
    this.response = {}
  }

  getNewProductQuantity(existingCartQty, productQty, incomingCartQty) {
    let newProductQuantity;
    const incomingQuantity = incomingCartQty;
    const existingQuantity = existingCartQty;

    if(incomingQuantity < existingQuantity) {
      newProductQuantity = productQty + Math.abs(existingQuantity - incomingQuantity)
    } else if (incomingQuantity > existingQuantity) {
      newProductQuantity = productQty - Math.abs(existingQuantity - incomingQuantity)
    } else { // if incomingQuantity and existingQuantity is the same return cartItemData
      return null; // no action is being performed because it's a duplicate request
    }
    return newProductQuantity;
  }

  getDeductProductPayload(productId, newProductQuantity) {
    let deductProductPayload = {
      productId,
      quantity: newProductQuantity
    }

    if(newProductQuantity == 10) {
      deductProductPayload.stock_level = 'running_low'
    } else if (newProductQuantity == 0) {
      deductProductPayload.stock_level = 'out_of_stock'
    }

    return deductProductPayload;
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
      newProductQuantity = this.getNewProductQuantity(getcartItemResponse.quantity, singleProduct.quantity, cartItemData.quantity);
      if (newProductQuantity == null) {
        return cartItemData;
      }
    } else {
      newProductQuantity = singleProduct.quantity - cartItemData.quantity;
    };



    const deductProductPayload = this.getDeductProductPayload(singleProduct.id, newProductQuantity);    
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
    let newProductQuantity;
    const productId = cartItemData.product_id;

    const singleProduct = await productsRepository.getById(cartItemData.product_id);
    if(singleProduct.quantity < cartItemData.quantity) {
      throw new Error ("quantity requested is more than inventory available.")
    };

    // check if the product already exists in cart
    let getcartItemResponse = await this.getCartItem({productId: productId});
    if(getcartItemResponse == null) {
      throw new Error ("product does not exist in specified cart.")
    }

    if(cartItemData.quantity == 0){
      throw new Error (`cannot update cart quantity with ${cartItemData.quantity}.`)
    }

    if(getcartItemResponse !== null) {
      newProductQuantity = this.getNewProductQuantity(getcartItemResponse.quantity, singleProduct.quantity, cartItemData.quantity);
      if (newProductQuantity == null) {
        return cartItemData;
      }
    }

    const deductProductPayload = this.getDeductProductPayload(singleProduct.id, newProductQuantity);    
    try {
      // update product inventory
      await productsRepository.updateProductInventory(productId, deductProductPayload);
      
      const { quantity } = cartItemData;
      const updateCartItemPayload = { quantity };

      // update cartItem with new quanitity
      let saveCartItemsResponse = await this.updateCartItem(updateCartItemPayload, {productId: productId});
      return saveCartItemsResponse;
    } catch (error) {
      console.error(error);
      throw new Error(error);      
    }
  }
}