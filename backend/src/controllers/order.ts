import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface IOrderBody {
  items: string[];
  total: number;
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body as IOrderBody;

    const products = await Product.find({ _id: { $in: items } });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));

    const missingId = items.find((id) => !productsById.has(id));
    if (missingId) {
      return next(new BadRequestError(`Товар с id ${missingId} не найден`));
    }

    const notForSaleId = items.find((id) => productsById.get(id)?.price === null);
    if (notForSaleId) {
      return next(new BadRequestError(`Товар с id ${notForSaleId} не продаётся`));
    }

    const sum = items.reduce((acc, id) => acc + (productsById.get(id)?.price ?? 0), 0);
    if (sum !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.send({ id: randomUUID(), total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
