import { Router } from 'express';
import expressCallback from "../express-callback"
import { cartValidator } from "../middlewares/validation-middleware";
import { add } from '../controllers/cart';

const router = Router();
export default (app) => {  
  app.use(router);
  router.post('/cart/add', cartValidator, expressCallback(add));
};