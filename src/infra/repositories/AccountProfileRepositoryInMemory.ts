import { IAccountProfileRepository } from "../../application/RepositoriesContracts/IAccountProfileRepository";
import { AccountProfile } from "../../domain/AccountProfile";

export class AccountProfileRepositoryInMemory implements IAccountProfileRepository {
    accounts: AccountProfile[] = [];

    static instance: AccountProfileRepositoryInMemory;

    static getInstance() {
        if (!AccountProfileRepositoryInMemory.instance) {
            AccountProfileRepositoryInMemory.instance = new AccountProfileRepositoryInMemory();
        }
        return AccountProfileRepositoryInMemory.instance;
    }

    async save(AccountProfile: AccountProfile): Promise<void> {
        this.accounts.push(AccountProfile);
    }
    async getByEmail(email: string): Promise<AccountProfile | null> {
        const accountProfile = this.accounts.find((account) => account.email === email);
        return accountProfile ?? null;
    }

    async getClientId(id: string): Promise<AccountProfile | null> {
        const accountProfile = this.accounts.find((account) => account.id === id);
        return accountProfile ?? null;
    }
    async close(): Promise<void> {}
}
