import { Router } from 'express';
import products from './routes/products';
import cart from "./routes/cart";


export default () => {
	const app = Router();
	products(app);
	cart(app);

	return app
}