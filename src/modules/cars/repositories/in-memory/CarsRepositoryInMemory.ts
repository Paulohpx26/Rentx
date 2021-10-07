import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IListCarsDTO } from '../dtos/IListCarsDTO';
import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    if (data.id) {
      const carExistent = this.cars.find(car => car.id === data.id);

      Object.assign(carExistent, {
        ...data,
      });

      return carExistent;
    }

    const car = new Car();

    Object.assign(car, {
      ...data,
    });

    this.cars.push(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find(car => car.id === id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async listAvailable({
    category_id,
    name,
    brand,
  }: IListCarsDTO): Promise<Car[]> {
    return this.cars.filter(
      car =>
        car.available &&
        (!name || car.name === name) &&
        (!brand || car.brand === brand) &&
        (!category_id || car.category_id === category_id),
    );
  }
}

export { CarsRepositoryInMemory };
