import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getCustomRepository, In } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface TransactionImport {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsRepositories = getCustomRepository(TransactionRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const transactionsImport: TransactionImport[] = [];
    const categoriesImport: string[] = [];
    const filePah = path.resolve(__dirname, '..', '..', 'tmp', `${filename}`);
    const csvParse = csv({
      columns: true,
      from_line: 1,
      delimiter: ', ',
    });

    await new Promise(resolve =>
      fs
        .createReadStream(`${filePah}`)
        .pipe(csvParse)
        .on('data', row => transactionsImport.push(row))
        .on('end', resolve),
    );

    transactionsImport.map(transaction =>
      categoriesImport.push(transaction.category),
    );

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categoriesImport),
      },
    });

    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categoriesImport
      .filter(category => !existentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    const addCategories = await categoriesRepository.save(newCategories);

    const finalCategories = [...addCategories, ...existentCategories];

    const createdTransactions = transactionsRepositories.create(
      transactionsImport.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepositories.save(createdTransactions);

    await fs.promises.unlink(filePah);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
