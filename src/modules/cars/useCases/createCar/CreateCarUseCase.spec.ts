import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const carCreated = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    expect(carCreated).toHaveProperty('id');
  });

  it('should not be able to create a car with exists license plate', async () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Name Car',
        description: 'Description Car',
        daily_rate: 100,
        license_plate: 'GTA-2393',
        fine_amount: 60,
        brand: 'Brand',
        category_id: '23',
      });

      await createCarUseCase.execute({
        name: 'Name Car2',
        description: 'Description Car2',
        daily_rate: 110,
        license_plate: 'GTA-2393',
        fine_amount: 70,
        brand: 'Brand2',
        category_id: '24',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with available true by default', async () => {
    const carCreated = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    expect(carCreated.available).toBe(true);
  });
});
