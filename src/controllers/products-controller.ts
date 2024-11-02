import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { knex } from '../database/setup-knex';
import { AppError } from '../utils/app-error';

export class ProductsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string({ message: 'Name é obrigatório!' }).trim(),
        price: z
          .number({ message: 'Price é obrigatório!' })
          .gt(0, { message: 'Price tem que ser positivo!' }),
      });

      const { name, price } = bodySchema.parse(request.body);

      const product = await knex<ProductRepository>('products')
        .insert({
          name,
          price,
        })
        .returning('*');

      response.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query;

      const product = await knex<ProductRepository>('products')
        .select('id', 'name', 'price')
        .whereLike('name', `%${name ?? ''}%`);
      response.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const [product] = await knex('products')
        .select('id', 'name', 'price')
        .where({ id });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      response.json(product);
    } catch (error) {
      next(error);
    }
  }
}
