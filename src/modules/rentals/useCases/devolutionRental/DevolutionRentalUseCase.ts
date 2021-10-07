import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const minimumDaily = 1;

    if (!rental) throw new AppError("Rental doesn't exist");

    if (rental.user_id !== user_id)
      throw new AppError("User isn't bound to this rental");

    if (rental.end_date) throw new AppError('Rental already closed');

    // Calculates amount to pay
    const car = await this.carsRepository.findById(rental.car_id);

    let daily = this.dateProvider.compareInDays(rental.start_date, new Date());

    if (daily >= 0) daily = minimumDaily;

    let total = daily * car.daily_rate;

    const delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      new Date(),
    );

    if (delay > 0) total += delay * car.fine_amount;

    rental.end_date = new Date();
    rental.total = total;

    await this.rentalsRepository.create(rental);

    car.available = true;
    await this.carsRepository.create(car);

    return rental;
  }
}

export { DevolutionRentalUseCase };
