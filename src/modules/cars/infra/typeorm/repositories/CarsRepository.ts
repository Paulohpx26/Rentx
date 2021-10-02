import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/repositories/dtos/ICreateCarDTO';
import { IListCarsDTO } from '@modules/cars/repositories/dtos/IListCarsDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  create({
    id,
    name,
    description,
    brand,
    daily_rate,
    fine_amount,
    license_plate,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      brand,
      daily_rate,
      fine_amount,
      license_plate,
      category_id,
      specifications,
    });

    return this.repository.save(car);
  }

  async findById(id: string): Promise<Car> {
    return this.repository.findOne(id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({ license_plate });
  }

  listAvailable({ name, brand, category_id }: IListCarsDTO): Promise<Car[]> {
    const filters = { name, brand, category_id };

    if (!name) delete filters.name;
    if (!brand) delete filters.brand;
    if (!category_id) delete filters.category_id;

    return this.repository.find(filters);
  }
}

export { CarsRepository };
