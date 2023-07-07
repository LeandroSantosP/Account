import { IAccountProfileRepository } from "../application/RepositoriesContracts/IAccountProfileRepository";
import { IAccountRepository } from "../application/RepositoriesContracts/IAccountRepository";
import { IChargeRepository } from "../application/RepositoriesContracts/IChargeRepository";

export interface RepositoryFactory {
    accountProfileRepository(): IAccountProfileRepository;
    accountRepository(): IAccountRepository;
    chargeRepository(): IChargeRepository;
}
