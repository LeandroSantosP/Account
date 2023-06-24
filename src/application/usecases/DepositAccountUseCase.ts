import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class DepositAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountByCode(
      input.account_code
    );

    const deposit_date = account.deposit(
      input.amount,
      new Date(input.deposit_date)
    );
    const { current_balance } = await this.accountRepository.UpdatedSaldo(
      account
    );

    return {
      ...deposit_date,
      current_balance: current_balance,
    };
  }
}

type Input = {
  account_code: string;
  amount: number;
  deposit_date: string;
};
type Output = {
  deposit_date: Date;
  current_balance: number;
};
