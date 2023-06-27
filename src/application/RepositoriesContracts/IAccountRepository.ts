import { Account } from "../../domain/Account";

export interface IAccountRepository {
    getAccountByClientId(client_id: string): Promise<Account | null>;
    getAccountByCode(code: string): Promise<Account>;
    UpdatedSaldo(account: Account): Promise<{ current_balance: number }>;
    save(account: Account): Promise<void>;
    getSequence(): Promise<number>;
    close(): Promise<void>;
}
