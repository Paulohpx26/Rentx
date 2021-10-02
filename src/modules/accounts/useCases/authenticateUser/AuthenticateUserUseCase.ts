import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email not found');

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError('Password not match');

    const token = sign({}, '55daecc6ed547eca265d9fe0f3d16030', {
      subject: user.id,
      expiresIn: '30d',
    });

    return {
      user: { name: user.name, email },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
