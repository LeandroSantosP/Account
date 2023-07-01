import { Knex } from "knex";
import { knex_connection } from "../../database/knex";
import { Account } from "../../domain/Account";
import { IAccountRepository } from "../../application/RepositoriesContracts/IAccountRepository";
import { CustomError } from "../http/middlewares/CustomError";

export class AccountRepositoryDatabase implements IAccountRepository {
    connection: Knex;

    constructor() {
        this.connection = knex_connection;
    }

    async getAccountByCode(code: string): Promise<Account> {
        const [accountData] = await this.connection("account")
            .select(
                "account.name",
                "account.client_id",
                "account.created_at",
                "account.sequence",
                "account.balance",
                "account_profile.email"
            )
            .innerJoin("account_profile", "account_profile.id", "account.client_id")
            .where("account.code", code);

        if (!accountData) throw new CustomError("Account not found");

        const account = Account.create(
            accountData.client_id,
            accountData.name,
            accountData.email,
            accountData.sequence,
            accountData.created_at
        );

        account.balance.value = parseFloat(accountData.balance);

        return account;
    }

    async UpdatedSaldo(account: Account): Promise<{ current_balance: number }> {
        const [accountData] = await this.connection("account")
            .where("code", account.getCode())
            .update({
                balance: account.balance.value,
            })
            .returning("balance");

        return {
            current_balance: parseFloat(accountData.balance),
        };
    }

    async getAccountByClientId(client_id: string): Promise<Account | null> {
        const [accountData] = await this.connection("account")
            .select(
                "account.name",
                "account.client_id",
                "account.created_at",
                "account.sequence",
                "account_profile.email",
                "account.balance",
                "account_profile.password"
            )
            .innerJoin("account_profile", "account_profile.id", "account.client_id")
            .where("client_id", client_id);

        if (!accountData) return null;

        const account = Account.create(
            accountData.client_id,
            accountData.name,
            accountData.email,
            accountData.sequence,
            accountData.create_at
        );

        account.balance.value = parseFloat(accountData.balance);
        return account;
    }

    async save(account: Account): Promise<void> {
        await this.connection("account").insert({
            name: account.name,
            client_id: account.client_id,
            code: account.getCode(),
            sequence: account.sequence,
            created_at: account.created_at,
            balance: account.balance.value,
        });
    }
    async getSequence(): Promise<number> {
        const sequence = await this.connection("account");

        return sequence.length + 1;
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
