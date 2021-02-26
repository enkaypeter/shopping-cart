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

  }
}