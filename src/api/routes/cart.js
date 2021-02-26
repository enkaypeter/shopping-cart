import { Router } from 'express';
import expressCallback from "../express-callback"
import { addToCartValidator, updateCartValidator, deleteCartValidator } from "../middlewares/validation-middleware";
import { add, update, deleteItem } from '../controllers/cart';

const router = Router();
export default (app) => {  
  app.use(router);
  router.post('/cart/add', addToCartValidator, expressCallback(add));
  router.patch('/cart/update', updateCartValidator, expressCallback(update));
  router.delete('/cart/delete', deleteCartValidator, expressCallback(deleteItem))
};