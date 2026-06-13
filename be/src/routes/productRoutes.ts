import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, smartExtract, smartExtractBulk } from '../controllers/productController';
import { authenticate, requirePermission } from '../middlewares/authorize';

const router = express.Router();

router.post('/smart-extract', authenticate, requirePermission('CREATE_PRODUCT'), smartExtract);
router.post('/smart-extract-bulk', authenticate, requirePermission('CREATE_PRODUCT'), smartExtractBulk);
router.get('/', getProducts);
router.post('/', authenticate, requirePermission('CREATE_PRODUCT'), createProduct);
router.get('/:slug', getProductBySlug);
router.put('/:id', authenticate, requirePermission('EDIT_PRODUCT'), updateProduct);
router.delete('/:id', authenticate, requirePermission('DELETE_PRODUCT'), deleteProduct);

export default router;
