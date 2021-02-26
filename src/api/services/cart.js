import CartRepository from "../repositiories/cart";
import ProductRepository from "../repositiories/products";

const productsRepository = new ProductRepository();

export default class CartService extends CartRepository {
  constructor(){
    super();
    this.response = {}
  }

  async addToCart (saveProductPayload) {
    let cart = await this.getCartById(1);

    // create a dummy cart if a cart with id = 1 doesn't exist
    let cartResponse = cart == undefined ? await this.createDummyCart() : cart
    const cartId = cartResponse.id;
    const singleProduct = await productsRepository.getById(saveProductPayload.product_id);
    if(singleProduct.quantity < saveProductPayload.quantity) {
      throw new Error ("quantity requested is more than inventory available.")
    };


    const newProductQuantity = singleProduct.quantity - saveProductPayload.quantity;
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
      const productId = saveProductPayload.product_id;
      // const deductProductQuantity = await this.productsRepository.updateProductInventory(productId, deductProductPayload);
      await productsRepository.updateProductInventory(productId, deductProductPayload);

      // create cartItems
      const { price, sku, quantity } = saveProductPayload;
      let saveCartItemPayload = {
        cartId: cartId,
        productId: productId,
        price,
        sku,
        quantity,
        created_at: new Date()
      };

      let cartItemResponse = await this.getCartItem({productId: productId});
      let saveCartItemsResponse = cartItemResponse !== null ? 
        await this.updateCartItem(saveCartItemPayload, {productId: productId}) :
      await this.saveToCart(saveCartItemPayload)

      return saveCartItemsResponse
    } catch (error) {
      console.error(error);
      throw new Error(error);      
    }

  }
}