import { ChargeWithOutTax } from "../../domain/ChargeWithOutTax";
import { RepositoryFactory } from "../../interfaces/RepositoryFactory";
import { IChargeRepository } from "../RepositoriesContracts/IChargeRepository";

export class PayChargeUsecase {
    private readonly chargeRepository: IChargeRepository;
    constructor(repositoryFactory: RepositoryFactory) {
        this.chargeRepository = repositoryFactory.chargeRepository();
    }

    async execute(input: Input): Promise<Output> {
        const currentCharge = await this.chargeRepository.get(input.charge_id);

        const { amount_pay, rest_for_payment } = currentCharge.pay({
            amount: input.amount,
            payment_date: new Date(input.date),
        });

        await this.chargeRepository.updated(currentCharge);

        const output: Output = {
            status: currentCharge.status,
            rest_for_payment,
            amount_pay,
        };
        return output;
    }
}

type Input = {
    charge_id: string;
    amount: number;
    date: string;
};

type Output = {
    status: string;
    amount_pay: number;
    rest_for_payment: number;
};
