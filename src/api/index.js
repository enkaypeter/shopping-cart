import { Router } from 'express';
import products from './routes/products';

export default () => {
	const app = Router();
	products(app);

	return app
}