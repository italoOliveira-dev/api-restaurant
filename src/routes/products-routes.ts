import { Router } from 'express';
import { ProductsController } from '../controllers/products-controller';

export const productsRoutes = Router();
const productController = new ProductsController();

productsRoutes.post('/', productController.create);
productsRoutes.get('/', productController.index);
