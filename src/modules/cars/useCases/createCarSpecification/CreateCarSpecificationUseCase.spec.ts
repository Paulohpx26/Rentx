import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { CreateSpecificationUseCase } from '../createSpecification/CreateSpecificationUseCase';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let createCarUseCase: CreateCarUseCase;
let createSpecificationUseCase: CreateSpecificationUseCase;

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);

    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory,
    );

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('should be able to add a new specification to the car', async () => {
    const carCreated = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'GTA-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    const specification = await createSpecificationUseCase.execute({
      name: 'Specification Name',
      description: 'Specification Description',
    });

    const specification2 = await createSpecificationUseCase.execute({
      name: 'Specification Name2',
      description: 'Specification Description2',
    });

    const specifications_id = [specification.id, specification2.id];

    await createCarSpecificationUseCase.execute({
      car_id: carCreated.id,
      specifications_id,
    });

    expect(carCreated).toHaveProperty('specifications');
    expect(carCreated.specifications.length).toBe(2);
  });

  it('should not be able to add a new specification to a non-existent car', async () => {
    expect(async () => {
      const car_id = 'any car id';
      const specifications_id = ['any specification id'];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
