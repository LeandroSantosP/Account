import { Account } from "../../Account";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: Input): Promise<void> {
    const account_exists = await this.accountRepository.getAccountByClientId(
      input.client_id
    );
    if (account_exists) throw new Error("Account already exists");

    const sequence = await this.accountRepository.getSequence();

    const newAccount = new Account(
      input.client_id,
      input.owner_name,
      sequence,
      new Date()
    );

    await this.accountRepository.save(newAccount);
  }
}

type Input = {
  client_id: string;
  owner_name: string;
};
