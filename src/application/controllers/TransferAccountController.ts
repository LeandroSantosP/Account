import { Request, Response } from "express";
import { TransferAccountUseCase } from "../usecases/TransferAccountUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { AwesomeApiAdapter } from "../../interfaces/AwesomeApiAdapter";
import { transfer_account_schema } from "../../utils/ZodSchemas";

export class TransferAccountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const repository = new AccountRepositoryDatabase();
        const currency = new AwesomeApiAdapter();
        const transferAccount = new TransferAccountUseCase(repository, currency);

        const input = transfer_account_schema.parse(request.body);

        const output = await transferAccount.execute(input);
        return response.status(201).json(output);
    }
}
