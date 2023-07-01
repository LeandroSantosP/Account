import { Request, Response } from "express";
import { WithDrawAccountUseCase } from "../usecases/WithDrawUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { withdraw_account_schema } from "../../utils/ZodSchemas";

export class WithDrawAccountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const accountRepository = new AccountRepositoryDatabase();

        const withDrawAccountUseCase = new WithDrawAccountUseCase(accountRepository);

        const input = withdraw_account_schema.parse(request.body);

        const output = await withDrawAccountUseCase.execute(input);

        return response.status(200).json(output);
    }
}
