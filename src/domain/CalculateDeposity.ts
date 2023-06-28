import { CustomError } from "../infra/http/middlewares/CustomError";
import { Currency } from "../interfaces/Currency";

export class CalculateDeposit {
    constructor(readonly currency: string, private readonly currencyCalculator: Currency) {}

    async execute(amount: number) {
        const { price } = await this.currencyCalculator.calculate({ currency: this.currency });
        // open-close dead
        if (this.currency === "BRL") {
            return amount * 1;
        }
        if (this.currency === "USD") {
            return amount * price;
        }

        if (this.currency === "EUR") {
            return amount * price;
        }

        if (this.currency === "BTC") {
            return amount * price;
        }

        throw new CustomError("Invalid Currency!");
    }
}
