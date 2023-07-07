import { Account } from "../../domain/Account";
import { IAccountRepository } from "../../application/RepositoriesContracts/IAccountRepository";
import { CustomError } from "../http/middlewares/CustomError";

export class AccountRepositoryInMemory implements IAccountRepository {
    accounts: Account[] = [];
    static instance: AccountRepositoryInMemory;

    static getInstance() {
        if (!AccountRepositoryInMemory.instance) {
            AccountRepositoryInMemory.instance = new AccountRepositoryInMemory();
        }
        return AccountRepositoryInMemory.instance;
    }

    async getAccountByClientId(client_id: string): Promise<Account | null> {
        const account = this.accounts.find((account) => account.client_id === client_id);
        return account ?? null;
    }
    async save(account: Account): Promise<void> {
        this.accounts.push(account);
    }
    async getSequence(): Promise<number> {
        return this.accounts.length + 1;
    }

    async getAccountByCode(code: string): Promise<Account> {
        const account = this.accounts.find((account) => account.getCode() === code);
        if (!account) throw new CustomError("Account not found");
        return account;
    }

    async UpdatedSaldo(account: Account): Promise<{ current_balance: number }> {
        const account_exits = await this.getAccountByCode(account.getCode());

        return {
            current_balance: account_exits.getBalance(),
        };
    }

    async close(): Promise<void> {}
}
