import { inject, injectable } from 'tsyringe';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';

@injectable()
class ListSpecificatonsUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepositories: ISpecificationsRepository,
  ) {}

  async execute(): Promise<Specification[]> {
    const specification = await this.specificationsRepositories.list();

    return specification;
  }
}

export { ListSpecificatonsUseCase };
