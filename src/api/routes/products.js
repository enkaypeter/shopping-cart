import { Router } from 'express';
import expressCallback from "../express-callback"

import { getAllProducts } from '../controllers/products';
const router = Router();

export default (app) => {  
  app.use(router);
  router.get('/products', expressCallback(getAllProducts));
};