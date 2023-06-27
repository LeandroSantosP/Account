import { Account } from "./Account";

export class TransferAccount {
    private constructor(private readonly from: Account, private readonly to: Account) {}

    static execute(from: Account, to: Account) {
        return new TransferAccount(from, to);
    }

    transfer(amount: number, operation_date: Date) {
        this.from.withdraw(amount, operation_date);
        this.to.deposit(amount, operation_date);
    }
}
