import { Account } from "../../Account";
import { IAccountRepository } from "../../application/RepositoriesContracts/IAccountRepository";

export class AccountRepositoryInMemory implements IAccountRepository {
  accounts: Account[] = [];

  async getAccountByClientId(client_id: string): Promise<Account | null> {
    const account = this.accounts.find(
      (account) => account.client_id === client_id
    );
    return account ?? null;
  }
  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }
  async getSequence(): Promise<number> {
    return this.accounts.length + 1;
  }
}
