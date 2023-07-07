import { ICalculateChargeTax } from "./ICalculateChargeTax";

export type PayOutput = {
    total_amount: number;
    amount_pay: number;
    rest_for_payment: number;
};

export abstract class Charge {
    status: string;
    payment_date?: Date;

    constructor(
        readonly id: string,
        readonly description: string,
        public amount: number,
        protected current_amount: number,
        readonly client_code: string,
        readonly CalculateTax: ICalculateChargeTax,

        readonly date: Date
    ) {
        this.status = "waiting_funds";
    }

    abstract pay(input: { payment_date: Date; amount: number }): PayOutput;
}
