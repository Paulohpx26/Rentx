import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayLoad {
  sub: string;
  email: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<IResponse> {
    const {
      secret_token,
      expires_in_token,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const { sub: user_id, email } = verify(
      token,
      secret_refresh_token,
    ) as IPayLoad;

    const userToken = await this.usersTokensRepository.findByUserIdAndToken(
      user_id,
      token,
    );

    if (!userToken) throw new AppError("Refresh token doesn't exists");

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshToken = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const expiresDateRefreshToken = this.dateProvider.addDays(
      expires_refresh_token_days,
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: refreshToken,
      expires_date: expiresDateRefreshToken,
    });

    const newToken = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    return { refresh_token: refreshToken, token: newToken };
  }
}

export { RefreshTokenUseCase };
