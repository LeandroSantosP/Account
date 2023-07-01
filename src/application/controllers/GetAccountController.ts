import { Request, Response } from "express";
import { GetAccountUseCase } from "../usecases/GetAccountUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { get_account_schema } from "../../utils/ZodSchemas";

export class GetAccountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { client_id } = get_account_schema.parse(request.params);

        const accountRepository = new AccountRepositoryDatabase();
        const getAccount = new GetAccountUseCase(accountRepository);
        const output = await getAccount.execute(client_id);

        return response.status(200).json(output);
    }
}
