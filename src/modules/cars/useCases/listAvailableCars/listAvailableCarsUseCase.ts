import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { IListCarsDTO } from '@modules/cars/repositories/dtos/IListCarsDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ category_id, brand, name }: IListCarsDTO): Promise<Car[]> {
    return this.carsRepository.listAvailable({ category_id, brand, name });
  }
}

export { ListAvailableCarsUseCase };
