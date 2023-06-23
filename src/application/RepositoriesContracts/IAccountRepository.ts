import { Account } from "../../Account";

export interface IAccountRepository {
  getAccountByClientId(client_id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
  getSequence(): Promise<number>;
}
