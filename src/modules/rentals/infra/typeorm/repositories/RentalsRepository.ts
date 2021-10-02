import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/repositories/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return this.repository.save(rental);
  }

  findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.repository.findOne({ car_id, end_date: null });
  }

  findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.repository.findOne({ user_id, end_date: null });
  }
}

export { RentalsRepository };
