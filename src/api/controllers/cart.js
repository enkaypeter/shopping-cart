import CartService from "../services/cart";
const cartService = new CartService();

const headers = {
  'Content-Type': 'application/json'
};

module.exports = {
  add: async (req, res) => {
    try {
      const { body } = req;
      const response = await cartService.addToCart(body);
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

  update: async (req, res) => {
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
  }
}