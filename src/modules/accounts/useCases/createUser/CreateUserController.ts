import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUserCase } from './CreateUserUseCase';

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserUseCase = container.resolve(CreateUserUserCase);

    const user = await createUserUseCase.execute(request.body);

    return response.status(201).json(user);
  }
}

export { CreateUserController };
