import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, smartExtract } from '../controllers/productController';

const router = express.Router();

router.post('/smart-extract', smartExtract);
router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:slug', getProductBySlug);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
