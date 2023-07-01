import { IAccountProfileRepository } from "../../application/RepositoriesContracts/IAccountProfileRepository";
import { AccountProfile } from "../../domain/AccountProfile";

import { knex_connection } from "../../database/knex";
import { Knex } from "knex";
import { Address } from "../../domain/Address";

export class AccountProfileRepositoryDatabase implements IAccountProfileRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }

    async save(AccountProfile: AccountProfile): Promise<void> {
        await this.connection.transaction(async (trx) => {
            const [addressId] = await trx("address")
                .insert({
                    street: AccountProfile.address.street,
                    city: AccountProfile.address.city,
                    number: AccountProfile.address.number,
                })
                .returning("id");

            await trx("account_profile").insert({
                id: AccountProfile.id,
                name: AccountProfile.name,
                email: AccountProfile.email,
                password: AccountProfile.password,
                address_id: addressId.id,
            });
        });
    }
    async getByEmail(email: string): Promise<AccountProfile | null> {
        const [accountData] = await this.connection("account_profile")
            .select(
                "account_profile.name",
                "account_profile.id as profile_id",
                "account_profile.email",
                "account_profile.password",
                "address.*"
            )
            .innerJoin("address", "account_profile.address_id", "address.id")
            .where({ "account_profile.email": email });

        if (!accountData) {
            return null;
        }

        const address = new Address(accountData.street, accountData.number, accountData.city);
        return new AccountProfile(accountData.name, accountData.email, accountData.password, address, accountData.id);
    }

    async getClientId(id: string): Promise<AccountProfile | null> {
        const [accountData] = await this.connection("account_profile")
            .select(
                "account_profile.name",
                "account_profile.id as profile_id",
                "account_profile.email",
                "account_profile.password",
                "address.*"
            )
            .innerJoin("address", "account_profile.address_id", "address.id")
            .where({ "account_profile.id": id });

        if (!accountData) {
            return null;
        }

        const address = new Address(accountData.street, accountData.number, accountData.city);
        return new AccountProfile(
            accountData.name,
            accountData.email,
            accountData.password,
            address,
            accountData.profile_id
        );
    }
    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
