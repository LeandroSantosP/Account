import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class WithDrawAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountByCode(
      input.account_code
    );

    const { withdraw_date } = account.withdraw(
      input.amount,
      new Date(input.withdraw_date)
    );

    await this.accountRepository.UpdatedSaldo(account);

    const output: Output = {
      current_balance: account.getBalance(),
      withdraw_date,
    };
    return output;
  }
}

type Input = {
  account_code: string;
  amount: number;
  withdraw_date: string;
};

type Output = {
  current_balance: number;
  withdraw_date: Date;
};
