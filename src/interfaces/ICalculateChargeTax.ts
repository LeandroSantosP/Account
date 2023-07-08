export type CalculateInput = {
    chargeDate: Date;
    operation_date: Date;
    current_amount: number;
    amount: number;
};
export interface ICalculateChargeTax {
    calculate(input: CalculateInput): number | void;
}
