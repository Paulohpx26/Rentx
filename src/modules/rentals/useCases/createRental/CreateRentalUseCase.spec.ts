import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: IDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();

    dateProvider = new DayjsDateProvider();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
    );
  });

  it('should be able to create a new rental', async () => {
    const rental = {
      user_id: 'any user id',
      car_id: 'any car id',
      expected_return_date: dayAdd24Hours,
    };

    const rentalCreated = await createRentalUseCase.execute(rental);

    expect(rentalCreated).toEqual(expect.objectContaining(rental));
    expect(rentalCreated).toHaveProperty('id');
  });

  it("should not be able to create a new rental if there's another open to the same user", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'same user id',
        car_id: 'any car id',
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: 'same user id',
        car_id: 'another car id',
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there's another open to the same car", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any user id',
        car_id: 'same car id',
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: 'another user id',
        car_id: 'same car id',
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if the return date is less than 24 hours', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any user id',
        car_id: 'same car id',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
