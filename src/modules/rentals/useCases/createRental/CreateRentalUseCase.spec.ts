import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from '@modules/cars/useCases/createCar/CreateCarUseCase';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let createCarUseCase: CreateCarUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: IDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();

    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dateProvider,
    );

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'TEST-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    const rental = {
      user_id: 'any user id',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    };

    const rentalCreated = await createRentalUseCase.execute(rental);

    expect(rentalCreated).toEqual(expect.objectContaining(rental));
    expect(rentalCreated).toHaveProperty('id');
  });

  it("should not be able to create a new rental if there's another open to the same user", async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'TEST-2393',
      fine_amount: 60,
      brand: 'Brand Car',
      category_id: '23',
    });

    await createRentalUseCase.execute({
      user_id: 'same user id',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const car2 = await createCarUseCase.execute({
      name: 'Name Car2',
      description: 'Description Car2',
      daily_rate: 100,
      license_plate: 'TEST-1252',
      fine_amount: 60,
      brand: 'Brand Car2',
      category_id: '23',
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'same user id',
        car_id: car2.id,
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError("There's a rental in progress for user"));
  });

  it('should not be able to create a new rental with a not available car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'TEST-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    await createRentalUseCase.execute({
      user_id: 'any user id',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'another user id',
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new rental if the return date is less than 24 hours', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'TEST-2393',
      fine_amount: 60,
      brand: 'Brand',
      category_id: '23',
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'any user id',
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('The return date is less than 24 hours'));
  });
});
