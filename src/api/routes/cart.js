import { Router } from 'express';
import expressCallback from "../express-callback"
import { addToCartValidator, updateCartValidator, deleteCartValidator } from "../middlewares/validation-middleware";
import { addItem, updateItem, deleteItem } from '../controllers/cart';

const router = Router();
export default (app) => {  
  app.use(router);
  router.post('/carts', addToCartValidator, expressCallback(addItem));
  router.patch('/carts', updateCartValidator, expressCallback(updateItem));
  router.delete('/carts', deleteCartValidator, expressCallback(deleteItem))
};