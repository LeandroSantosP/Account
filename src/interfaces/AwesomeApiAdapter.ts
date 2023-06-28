import { Currency, Input, Output } from "./Currency";
import axios from "axios";

export class AwesomeApiAdapter implements Currency {
    async calculate({ currency }: Input): Promise<Output> {
        if (currency === "BRL") {
            return {
                code: "BRL",
                price: 1,
            };
        }

        let availableCurrencies = {
            USD: "USD-BRL",
            EUR: "EUR-BRL",
            BTC: "BTC-BRL",
        } as { [key: string]: string };

        const url = `https://economia.awesomeapi.com.br/json/last/${availableCurrencies[currency]}`;

        let formatsResults = {
            USD: "USDBRL",
            EUR: "EURBRL",
            BTC: "BTCBRL",
        } as { [key: string]: string };
        const { data } = await axios.get(url);
        const output: Output = {
            code: data[formatsResults[currency]].code,
            price: parseFloat(data[formatsResults[currency]].high),
        };
        return output;
    }
}
