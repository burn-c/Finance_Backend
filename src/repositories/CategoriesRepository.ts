import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';
import CreateCategoryService from '../services/CreateCategoryService';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategory(category: string): Promise<string> {
    const findCategory = await this.findOne({
      where: { title: category },
    });

    if (!findCategory) {
      const createCategory = new CreateCategoryService();

      const newCategory = await createCategory.execute(category);

      const category_id = newCategory.id;

      return category_id;
    }

    const category_id = findCategory.id;

    return category_id;
  }
}

export default CategoriesRepository;
