import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async findById(id: string): Promise<Rental> {
    return this.rentals.find(rental => rental.id === id);
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    if (data.id) {
      const rentalExistent = this.rentals.find(rental => rental.id === data.id);

      Object.assign(rentalExistent, data);

      return rentalExistent;
    }

    const rental = new Rental();

    Object.assign(rental, {
      ...data,
      start_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.car_id === car_id && !rental.end_date,
    );
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.user_id === user_id && !rental.end_date,
    );
  }

  async listByUser(user_id: string): Promise<Rental[]> {
    return this.rentals.filter(rental => rental.user_id === user_id);
  }
}
export { RentalsRepositoryInMemory };
