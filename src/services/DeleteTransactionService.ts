import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<boolean | void> {
    const trasactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = await trasactionsRepository.findOne({ id });
    if (!transaction) {
      throw new AppError('Error', 500);
    }
    trasactionsRepository.remove(transaction);
    return true;
  }
}

export default DeleteTransactionService;
