import { AwesomeApiAdapter } from "../interfaces/AwesomeApiAdapter";
import { Currency } from "../interfaces/Currency";
import { AccountCode } from "./AccountCode";
import { Balance } from "./Balance";
import { CalculateDeposit } from "./CalculateDeposity";

export class Account {
    balance: Balance;
    private code: AccountCode;

    constructor(
        readonly client_id: string,
        readonly name: string,
        readonly sequence = 1,
        readonly created_at: Date,
        readonly email: string,
        private currency_format: Currency
    ) {
        this.code = new AccountCode(created_at, sequence);
        this.balance = new Balance(0);
    }

    static create(
        client_id: string,
        name: string,
        email: string,
        sequence = 1,
        create_at?: Date,
        currency = new AwesomeApiAdapter()
    ) {
        const current_date = create_at ?? new Date();
        return new Account(client_id, name, sequence, current_date, email, currency);
    }

    getBalance() {
        return this.balance.value;
    }

    async deposit(amount: number, deposit_date = new Date(), current_date = new Date(), currency = "BRL") {
        const not_is_future_date = deposit_date.getTime() - current_date.getTime() < 0;

        if (not_is_future_date) {
            throw new Error(`Deposit date (${deposit_date}) is invalid, must be future date!`);
        }
        if (amount < 0) {
            throw new Error(`Deposit ${amount} is invalid, must be positive value!`);
        }

        const calculateDeposit = new CalculateDeposit(currency, this.currency_format);
        const amountCalculate = await calculateDeposit.execute(amount);

        this.balance.value += amountCalculate;

        return {
            deposit_date,
        };
    }

    withdraw(amount: number, withdraw_date: Date, current_date = new Date()) {
        const not_is_future_date = withdraw_date.getTime() - current_date.getTime() < 0;

        if (not_is_future_date) {
            throw new Error(`Withdraw date (${withdraw_date}) is invalid, must be future date!`);
        }

        if (amount < 0) {
            throw new Error(`Withdraw ${amount} is invalid, must be positive value!`);
        }

        const client_current_balance = this.balance.value;

        if (client_current_balance < amount) {
            throw new Error(
                `Does not have this amount (${amount}) to withdraw, current account balance (${client_current_balance}).`
            );
        }

        this.balance.value -= amount;
        return {
            amount,
            withdraw_date,
        };
    }

    getCode() {
        return this.code.value;
    }
}
