import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { knex } from '../database/setup-knex';

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
}
