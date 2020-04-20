// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

class CreateCategoryService {
  public async execute(category: string): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const newcategory = categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(newcategory);

    return newcategory;
  }
}

export default CreateCategoryService;
