import { inject, injectable } from 'tsyringe';

import { ICarImagesRepository } from '@modules/cars/repositories/ICarImagesRepository';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    await Promise.all(
      images_name.map(image_name =>
        this.carImagesRepository.create(car_id, image_name),
      ),
    );
  }
}

export { UploadCarImagesUseCase };
