import { RepositoryFactory } from "../../interfaces/RepositoryFactory";
import { AccountProfileRepositoryDatabase } from "../repositories/AccountProfileRepositoryDatabase";
import { AccountRepositoryDatabase } from "../repositories/AccountRepositoryDatabase";
import { ChargeRepositoryDatabase } from "../repositories/ChargeRepositoryDatabase";

export class RepositoryFactoryDatabase implements RepositoryFactory {
    accountProfileRepository(): AccountProfileRepositoryDatabase {
        return new AccountProfileRepositoryDatabase();
    }
    accountRepository(): AccountRepositoryDatabase {
        return new AccountRepositoryDatabase();
    }

    chargeRepository(): ChargeRepositoryDatabase {
        return new ChargeRepositoryDatabase();
    }
}
