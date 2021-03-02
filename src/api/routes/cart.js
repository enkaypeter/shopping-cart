import { Router } from 'express';
import expressCallback from "../express-callback"
import { addItem, updateItem, deleteItem, getCartItem } from '../controllers/cart';
import {
  addToCartValidator, updateCartValidator, 
  deleteCartValidator, getCartItemsValidator
} from "../middlewares/validation-middlewares";

const router = Router();
export default (app) => {  
  app.use(router);
  router.get('/carts/:cart_id', getCartItemsValidator, expressCallback(getCartItem));
  router.post('/carts', addToCartValidator, expressCallback(addItem));
  router.patch('/carts', updateCartValidator, expressCallback(updateItem));
  router.delete('/carts', deleteCartValidator, expressCallback(deleteItem))
};