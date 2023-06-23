import { Account } from "../../Account";
import { IAccountRepository } from "../../application/RepositoriesContracts/IAccountRepository";

export class AccountRepository implements IAccountRepository {
  connection: any;
  constructor() {}
  async getAccountByClientId(client_id: string): Promise<Account | null> {
    throw new Error("Method not implemented.");
  }
  async save(account: Account): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getSequence(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
