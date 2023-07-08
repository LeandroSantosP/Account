import { randomUUID } from "crypto";
import { Charge, PayOutput } from "./Charge";
import { ICalculateChargeTax } from "../interfaces/ICalculateChargeTax";
import { CalculateChargeTax } from "./CalculateChargeTax";

export class ChargeWithOutTax extends Charge {
    private constructor(
        id: string,
        description: string,
        amount: number,
        current_amount: number,
        client_code: string,
        CalculateTax: ICalculateChargeTax,
        date: Date
    ) {
        super(id, description, amount, current_amount, client_code, CalculateTax, date);
    }
    static create(
        description: string,
        amount: number,
        client_code: string,
        date = new Date(),
        id: string = randomUUID(),
        CalculateTax = new CalculateChargeTax()
    ) {
        return new ChargeWithOutTax(id, description, amount, amount, client_code, CalculateTax, date);
    }
    pay(input: { payment_date: Date; amount: number }): PayOutput {
        if (input.amount > this.current_amount) {
            throw new Error(`Invalid amount ${input.amount}, current value for pay ${this.current_amount}`);
        }

        this.payment_date = input.payment_date;
        this.current_amount -= input.amount;

        if (this.current_amount === 0) {
            this.status = "paid";
        }
        return {
            total_amount: this.amount,
            amount_pay: input.amount,
            rest_for_payment: this.current_amount,
        };
    }
}
