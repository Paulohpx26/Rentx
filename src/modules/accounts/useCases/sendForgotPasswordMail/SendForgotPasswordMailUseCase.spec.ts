import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Password Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'User name',
      email: 'user@email.com',
      driver_license: 'XXXX',
      password: 'User password',
    });

    await sendForgotPasswordMailUseCase.execute('user@email.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('user@email.com'),
    ).rejects.toEqual(new AppError("User doesn't exists"));
  });

  it('should be able to create an user token', async () => {
    const generateTokenEmail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create',
    );

    await usersRepositoryInMemory.create({
      name: 'User name',
      email: 'user@email.com',
      driver_license: 'XXXX',
      password: 'User password',
    });

    await sendForgotPasswordMailUseCase.execute('user@email.com');

    expect(generateTokenEmail).toHaveBeenCalled();
  });
});
