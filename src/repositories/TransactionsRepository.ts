import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  // public async getBalance(): Promise<Balance> {
  // //   const incomeTransactions = await this.find({
  // //     where: { type === 'income'}
  //   })
  //   // this.transactions.filter(
  //   //   transaction => transaction.type === 'income',
  //   // );
  //   const outcomeTransactions = this.transactions.filter(
  //     transaction => transaction.type === 'outcome',
  //   );
  //   const income = incomeTransactions.reduce((prevTotal, currentValue) => {
  //     return prevTotal + currentValue.value;
  //   }, 0);
  //   const outcome = outcomeTransactions.reduce((prevTotal, currentValue) => {
  //     return prevTotal + currentValue.value;
  //   }, 0);
  //   const total = income - outcome;
  //   return { income, outcome, total };
  // }
}

export default TransactionsRepository;
