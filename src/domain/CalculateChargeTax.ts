import { ICalculateChargeTax, CalculateInput } from "../interfaces/ICalculateChargeTax";

export class CalculateChargeTax implements ICalculateChargeTax {
    calculate(input: CalculateInput): number | void {
        if (!input.operation_date) return;
        const differenceInMillie = Math.abs(input.chargeDate.getTime() - input.operation_date.getTime());
        const differenceInMonths = differenceInMillie / (1000 * 60 * 60 * 24 * 30);
        const tax = input.amount * 0.1;

        if (differenceInMonths >= 1) {
            return (input.current_amount += tax);
        }
    }
}
