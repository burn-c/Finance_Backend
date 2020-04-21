import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';

import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

// List transactions and balance
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

// Import .csv file
transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { filename } = request.file;

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(filename);

    return response.json(transactions);
  },
);

export default transactionsRouter;
