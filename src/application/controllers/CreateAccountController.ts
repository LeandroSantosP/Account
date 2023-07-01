import { Request, Response } from "express";

import { CreateAccountUseCase } from "../usecases/CreateAccountUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { create_account_schema } from "../../utils/ZodSchemas";
import { Queue } from "../../infra/queue/Queue";
import { AccountProfileRepositoryDatabase } from "../../infra/repositories/AccountProfileRepositoryDatabase";

export class CreateAccountController {
    constructor(private readonly queue: Queue) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const input = create_account_schema.parse(request.body);

        const accountRepository = new AccountRepositoryDatabase();
        const accountProfileRepository = new AccountProfileRepositoryDatabase();

        const createAccount = new CreateAccountUseCase(accountRepository, this.queue, accountProfileRepository);

        await createAccount.execute(input);

        return response.status(201).send();
    }
}
