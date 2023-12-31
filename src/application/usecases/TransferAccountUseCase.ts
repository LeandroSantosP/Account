import { TransferAccount } from "../../domain/TransferAccount";
import { Currency } from "../../interfaces/Currency";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class TransferAccountUseCase {
    constructor(private readonly accountRepository: IAccountRepository, private calculateCurrency: Currency) {}

    async execute(input: Input): Promise<void> {
        const account_from = await this.accountRepository.getAccountByCode(input.from);
        const account_to = await this.accountRepository.getAccountByCode(input.to);

        const transferAccount = TransferAccount.execute(account_from, account_to);

        await transferAccount.transfer(input.amount, new Date(input.transfer_date), this.calculateCurrency);

        await this.accountRepository.UpdatedSaldo(account_from);
        await this.accountRepository.UpdatedSaldo(account_to);
    }
}

type Input = {
    from: string;
    to: string;
    amount: number;
    transfer_date: string;
};
