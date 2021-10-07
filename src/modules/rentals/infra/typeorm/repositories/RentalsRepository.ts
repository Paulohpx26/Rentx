import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/repositories/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  findById(id: string): Promise<Rental> {
    return this.repository.findOne(id);
  }

  create({
    id,
    car_id,
    user_id,
    expected_return_date,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      id,
      car_id,
      user_id,
      expected_return_date,
      end_date,
      total,
    });

    return this.repository.save(rental);
  }

  findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.repository.findOne({ car_id, end_date: null });
  }

  findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.repository.findOne({ user_id, end_date: null });
  }

  listByUser(user_id: string): Promise<Rental[]> {
    return this.repository.find({
      where: { user_id },
      relations: ['car'],
    });
  }
}

export { RentalsRepository };
