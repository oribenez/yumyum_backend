import express from 'express';

import { createOrder } from '../controllers/orders-controller';

const router = express.Router();

router.post('/checkout', createOrder);

export default router;
