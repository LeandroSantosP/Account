import { Request, Response } from "express";
import { DepositAccountUseCase } from "../usecases/DepositAccountUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { AwesomeApiAdapter } from "../../interfaces/AwesomeApiAdapter";
import { deposit_account_schema } from "../../utils/ZodSchemas";

export class DepositAccountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const accountRepository = new AccountRepositoryDatabase();
        const calculateCurrency = new AwesomeApiAdapter();
        const depositAccount = new DepositAccountUseCase(accountRepository, calculateCurrency);

        const input = deposit_account_schema.parse(request.body);

        const output = await depositAccount.execute(input);

        return response.status(200).json(output);
    }
}
