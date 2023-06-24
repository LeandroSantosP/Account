import { Knex } from "knex";
import { knex_connection } from "../../database/knex";
import { Account } from "../../domain/Account";
import { IAccountRepository } from "../../application/RepositoriesContracts/IAccountRepository";

export class AccountRepository implements IAccountRepository {
  connection: Knex;

  constructor() {
    this.connection = knex_connection;
  }

  getAccountByCode(code: string): Promise<Account> {
    throw new Error("Method not implemented.");
  }
  UpdatedSaldo(account: Account): Promise<{ current_balance: number }> {
    throw new Error("Method not implemented.");
  }
  async getAccountByClientId(client_id: string): Promise<Account | null> {
    const [accountData] = await this.connection("account").where(
      "client_id",
      client_id
    );

    if (!accountData) return null;

    return Account.create(
      accountData.client_id,
      accountData.name,
      accountData.sequence,
      accountData.created_at
    );
  }

  async save(account: Account): Promise<void> {
    await this.connection("account").insert({
      name: account.name,
      client_id: account.client_id,
      code: account.getCode(),
      sequence: account.sequence,
    });
  }
  async getSequence(): Promise<number> {
    const sequence = await this.connection("account").count();
    return sequence.length + 1;
  }

  async close(): Promise<void> {
    await this.connection.destroy();
  }
}
