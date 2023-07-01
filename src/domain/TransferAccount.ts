import { Currency } from "../interfaces/Currency";
import { Account } from "./Account";

export class TransferAccount {
    private constructor(private readonly from: Account, private readonly to: Account) {}

    static execute(from: Account, to: Account) {
        return new TransferAccount(from, to);
    }

    async transfer(amount: number, operation_date: Date, currency: Currency) {
        this.from.withdraw(amount, operation_date);

        await this.to.deposit(amount, operation_date, operation_date, "BRL", currency);
    }
}
