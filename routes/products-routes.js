import express from 'express';

import {
	createProduct,
	getProducts,
} from '../controllers/products-controller.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProduct);

export default router;
