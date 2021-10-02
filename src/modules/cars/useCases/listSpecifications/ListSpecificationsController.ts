import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListSpecificatonsUseCase } from './ListSpecificationsUseCase';

class ListSpecificatonsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSpecificatonsUseCase = container.resolve(
      ListSpecificatonsUseCase,
    );

    const all = await listSpecificatonsUseCase.execute();

    return response.json(all);
  }
}

export { ListSpecificatonsController };
