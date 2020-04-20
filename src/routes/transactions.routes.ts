import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';

import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

// Create transaction
transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const createTransaction = new CreateTransactionService();

  const category_id = await categoriesRepository.getCategory(category);

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_id,
  });

  return response.json(transaction);
});

// Delete transaction
transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTrasaction = new DeleteTransactionService();

  const status = await deleteTrasaction.execute(id);

  return response.status(200).json(status);
});

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
