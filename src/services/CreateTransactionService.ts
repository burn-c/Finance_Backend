// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionsRepositories = getCustomRepository(TransactionRepository);

    const transaction = transactionsRepositories.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepositories.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
