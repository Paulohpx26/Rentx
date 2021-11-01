import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserToken } from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    return this.repository.save(userToken);
  }

  findByUserIdAndToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    return this.repository.findOne({ user_id, refresh_token });
  }

  findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return this.repository.findOne({ refresh_token });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.repository.delete({ user_id });
  }
}

export { UsersTokensRepository };
