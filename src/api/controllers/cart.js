import CartService from "../services/cart";
const cartService = new CartService();

const headers = {
  'Content-Type': 'application/json'
};

module.exports = {
  addItem: async (req, res) => {
    try {
      const { body } = req;
      const response = await cartService.makeAddToCart(body);
      return {
        headers,
        message: "item added to cart successfully",
        status: "success",
        statusCode: 200,
        body: response
      }
    } catch (e) {
      console.error(e);
      return {
        headers,
        message: "failed to add item to cart",
        status: "error",
        statusCode: 400,
        body:{
          error: e.message
        }
      }
    }
  },

  updateItem: async (req, res) => {
    try {
      const { body } = req;
      const response = await cartService.makeUpdateCart(body);
      return {
        headers,
        message: "product quantity updated successfully.",
        status: "success",
        statusCode: 200,
        body: response
      }
    } catch (e) {
      console.error(e);
      return {
        headers,
        message: "failed to update product quantity in cart.",
        status: "error",
        statusCode: 400,
        body:{
          error: e.message
        }
      }
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { body } = req;
      const response = await cartService.makeDelete(body);
      return {
        headers,
        message: "product removed from cart successfully.",
        status: "success",
        statusCode: 200,
        body: response
      }
    } catch (e) {
      console.error(e);
      return {
        headers,
        message: "failed to remove product from cart.",
        status: "error",
        statusCode: 400,
        body:{
          error: e.message
        }
      }
    }
  },

  getCartItem: async (req, res) => {
    try {
      const { cart_id } = req.params;
      const response = await cartService.makeGetCartItem(cart_id);
      return {
        headers,
        message: "cart items fetched successfully.",
        status: "success",
        statusCode: 200,
        body: response
      }
    } catch (e) {
      console.error(e);
      return {
        headers,
        message: "failed to fetch cart items successfully.",
        status: "error",
        statusCode: 400,
        body:{
          error: e.message
        }
      }
    }
  }
}