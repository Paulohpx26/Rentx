import { Car } from '../infra/typeorm/entities/Car';
import { ICreateCarDTO } from './dtos/ICreateCarDTO';
import { IListCarsDTO } from './dtos/IListCarsDTO';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  listAvailable({ category_id, name, brand }: IListCarsDTO): Promise<Car[]>;
  findById(id: string): Promise<Car>;
}

export { ICarsRepository };
