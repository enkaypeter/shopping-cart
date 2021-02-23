import ProductService from "../services/products";
const productService = new ProductService();

const headers = {
  'Content-Type': 'application/json'
};

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const response = await productService.fetchAlProducts();
      
      return {
        headers,
        message: "products fetch successful",
        status: "success",
        statusCode: 200,
        body: response
      }
    } catch (e) {
      console.error(e);
      return {
        headers,
        message: "failed to fetch all products",
        status: "error",
        statusCode: 400,
        body:{
          error: e.message
        }
      }
    }
  }
}