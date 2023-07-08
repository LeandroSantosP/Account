import { ChargeWithOutTax } from "../../domain/ChargeWithOutTax";
import { RepositoryFactory } from "../../interfaces/RepositoryFactory";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";
import { IChargeRepository } from "../RepositoriesContracts/IChargeRepository";

export class MackChargeUsecase {
    chargeRepository: IChargeRepository;
    accountRepository: IAccountRepository;
    constructor(repositoryFactory: RepositoryFactory) {
        this.accountRepository = repositoryFactory.accountRepository();
        this.chargeRepository = repositoryFactory.chargeRepository();
    }

    async execute(input: Input): Promise<Output> {
        const account = await this.accountRepository.getAccountByCode(input.account_code);
        const charge = ChargeWithOutTax.create(input.description, input.amount, account.getCode(), new Date());
        await this.chargeRepository.save(charge);

        const output: Output = {
            amount: charge.amount,
            date: charge.date,
            status: charge.status,
        };
        return output;
    }
}

type Input = {
    account_code: string;
    amount: number;
    description: string;
};

type Output = {
    amount: number;
    date: Date;
    status: string;
};
