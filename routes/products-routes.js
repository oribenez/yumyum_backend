import express from "express";

import {
	createProduct,
	getProducts,
} from "../controllers/products-controller.js";
import { checkAuth } from "../middleware/check-auth.js"; 

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", createProduct);

//	Authorization check
router.use(checkAuth);

export default router;
