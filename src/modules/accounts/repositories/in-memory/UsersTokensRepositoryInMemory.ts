import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUsersTokensRepository } from '../IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserToken[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, data);

    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    return this.usersTokens.find(
      userToken =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token,
    );
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return this.usersTokens.find(
      userToken => userToken.refresh_token === refresh_token,
    );
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(
      userToken => userToken.id === id,
    );

    this.usersTokens.splice(userTokenIndex, 1);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter(
      userToken => userToken.user_id !== user_id,
    );
  }
}

export { UsersTokensRepositoryInMemory };
