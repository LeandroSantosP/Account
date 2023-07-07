import { RepositoryFactory } from "../../interfaces/RepositoryFactory";
import { AccountProfileRepositoryInMemory } from "../repositories/AccountProfileRepositoryInMemory";
import { AccountRepositoryInMemory } from "../repositories/AccountRepositoryInMemory";
import { ChargeRepositoryMemory } from "../repositories/ChargeRepositoryMemory";

export class RepositoryFactoryMemory implements RepositoryFactory {
    accountProfileRepository(): AccountProfileRepositoryInMemory {
        return AccountProfileRepositoryInMemory.getInstance();
    }
    accountRepository(): AccountRepositoryInMemory {
        return AccountRepositoryInMemory.getInstance();
    }

    chargeRepository(): ChargeRepositoryMemory {
        return ChargeRepositoryMemory.getInstance();
    }
}
