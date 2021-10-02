import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { ListAvailableCarsUseCase } from './listAvailableCarsUseCase';

let createCarUseCase: CreateCarUseCase;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Available Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-1111',
      fine_amount: 50,
      brand: 'Brand Car',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          available: false,
        }),
      ]),
    );
  });

  it('should be able to list all available cars by name', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car Example',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-1111',
      fine_amount: 50,
      brand: 'Brand Car',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Name Car Example',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car Example',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-1111',
      fine_amount: 50,
      brand: 'Brand Car',
      category_id: 'category id example',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category id example',
    });

    expect(cars).toEqual([car]);
  });
});
