import { Account } from "../../domain/Account";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: Input): Promise<void> {
    const account_exists = await this.accountRepository.getAccountByClientId(
      input.client_id
    );

    if (account_exists) throw new Error("Account already exists");

    const sequence = await this.accountRepository.getSequence();

    const newAccount = Account.create(
      input.client_id,
      input.owner_name,
      sequence
    );

    await this.accountRepository.save(newAccount);
  }
}

type Input = {
  client_id: string;
  owner_name: string;
};
