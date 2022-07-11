import { inject, injectable } from 'tsyringe';

import { ICarImagesRepository } from '@modules/cars/repositories/ICarImagesRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    await Promise.all(
      images_name.reduce((previousValue, currentValue) => {
        previousValue.push(
          this.storageProvider.save(currentValue, 'cars'),
          this.carImagesRepository.create(car_id, currentValue),
        );

        return previousValue;
      }, []),
    );
  }
}

export { UploadCarImagesUseCase };
